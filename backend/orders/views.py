from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from django.db import transaction
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer ,OrderStatusUpdateSerializer
import rest_framework.status as status
from accounts.models import Address
from django.shortcuts import get_object_or_404
from products.models import Product 


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        if request.user.role != "CUSTOMER":
            return Response(
                {"error": "Only customers can checkout"},
                status=status.HTTP_403_FORBIDDEN
            )

        customer = request.user.customerprofile
        address_id = request.data.get("address_id")
        items = request.data.get("items", [])

        if not address_id:
            return Response(
                {"error": "Shipping address is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Validate address
        address = get_object_or_404(
            Address,
            id=address_id,
            customer=customer
        )

        total = 0

        # ✅ First pass: validate stock & calculate total
        for item in items:
            product = get_object_or_404(Product, id=item["product_id"])

            if product.stock_quantity < item["quantity"]:
                return Response(
                    {"error": f"Insufficient stock for {product.title}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            total += product.price * item["quantity"]

      
        order = Order.objects.create(
            customer=customer,
            total_amount=total,
            shipping_address_id=address.id
        )

       
        for item in items:
            product = Product.objects.select_for_update().get(
                id=item["product_id"]
            )

            OrderItem.objects.create(
                order=order,
                product=product,
                seller=product.seller,
                quantity=item["quantity"],
                price=product.price
            )

            product.stock_quantity -= item["quantity"]
            product.save()

        return Response(
            {
                "message": "Order placed successfully",
                "order_id": order.id
            },
            status=status.HTTP_201_CREATED
        )

class CustomerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'CUSTOMER':
            return Response({"error": "Not allowed"}, status=403)

        orders = Order.objects.filter(customer=request.user.customerprofile)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class SellerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SELLER':
            return Response({"error": "Not allowed"}, status=403)

        seller = request.user.sellerprofile
        items = OrderItem.objects.filter(seller=seller)
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, order_item_id):
        if request.user.role != 'SELLER':
            return Response({"error": "Not allowed"}, status=403)

        try:
            item = OrderItem.objects.get(
                id=order_item_id,
                seller=request.user.sellerprofile
            )
        except OrderItem.DoesNotExist:
            return Response({"error": "Order item not found"}, status=404)

        serializer = OrderStatusUpdateSerializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Order status updated"})

class AdminOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CancelOrderItemView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, order_item_id):
        if request.user.role != 'CUSTOMER':
            return Response({"error": "Not allowed"}, status=403)

        try:
            item = OrderItem.objects.select_for_update().get(
                id=order_item_id,
                order__customer=request.user.customerprofile
            )
        except OrderItem.DoesNotExist:
            return Response({"error": "Order item not found"}, status=404)

        if item.status in ['SHIPPED', 'DELIVERED']:
            return Response(
                {"error": "Order already shipped, cannot cancel"},
                status=400
            )

        # restore stock
        product = item.product
        product.stock_quantity += item.quantity
        product.save()

        item.status = 'CANCELLED'
        item.save()

        return Response({"message": "Order cancelled successfully"})

