from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_title',
            'seller',
            'seller_name',
            'quantity',
            'price',
            'status'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_status',
            'total_amount',
            'shipping_address_id',
            'created_at',
            'items'
        ]

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['status']

class CancelOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = []
