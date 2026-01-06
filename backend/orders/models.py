from django.db import models
from accounts.models import CustomerProfile, SellerProfile
from products.models import Product

class Order(models.Model):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.PROTECT)
    order_status = models.CharField(
        max_length=20,
        choices=[
            ('PLACED', 'Placed'),
            ('SHIPPED', 'Shipped'),
            ('DELIVERED', 'Delivered'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='PLACED'
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address_id = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    seller = models.ForeignKey(SellerProfile, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('PLACED', 'Placed'),
            ('SHIPPED', 'Shipped'),
            ('DELIVERED', 'Delivered'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='PLACED'
    )
