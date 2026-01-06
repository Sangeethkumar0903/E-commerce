from django.db import models
from accounts.models import CustomerProfile
from products.models import Product

class Cart(models.Model):
    customer = models.OneToOneField(CustomerProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)
