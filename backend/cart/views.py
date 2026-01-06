from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import rest_framework.status as status

from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer


# ➕ ADD TO CART
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "CUSTOMER":
            return Response({"error": "Only customers can add to cart"}, status=403)

        product_id = request.data.get("product_id")
        quantity = int(request.data.get("stock_quantity", 1))

        product = get_object_or_404(Product, id=product_id)

        if product.stock_quantity < quantity:
            return Response({"error": "Insufficient stock"}, status=400)

        customer = request.user.customerprofile
        cart, _ = Cart.objects.get_or_create(customer=customer)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"price_at_time": product.price,
                        "quantity": quantity
                      }
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Added to cart"}, status=200)


# 🛒 VIEW CART
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "CUSTOMER":
            return Response(
                {"error": "Only customers have carts"},
                status=status.HTTP_403_FORBIDDEN
            )
        cart, _ = Cart.objects.get_or_create(
            customer=request.user.customerprofile
        )
        serializer = CartSerializer(cart)
        return Response(serializer.data)


# ✏️ UPDATE CART ITEM
class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        quantity = int(request.data.get("quantity", 1))

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__customer=request.user.customerprofile
        )

        if quantity <= 0:
            cart_item.delete()
            return Response({"message": "Item removed"})

        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Quantity updated"})


# ❌ DELETE CART ITEM
class DeleteCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__customer=request.user.customerprofile
        )
        cart_item.delete()

        return Response({"message": "Item deleted"})
