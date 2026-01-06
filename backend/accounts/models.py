from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role='CUSTOMER'):
        if not email:
            raise ValueError("Email required")
        user = self.model(
            email=self.normalize_email(email),
            role=role
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password, role='SELLER')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('SELLER', 'Seller'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
    
class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    store_name = models.CharField(max_length=150)
    gst_number = models.CharField(max_length=20, blank=True)
    pan_number = models.CharField(max_length=20, blank=True)
    bank_account = models.CharField(max_length=50, blank=True)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.store_name

class Address(models.Model):
    customer = models.ForeignKey(
        CustomerProfile,
        on_delete=models.CASCADE,
        related_name="addresses"
    )
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address_line = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.address_line}, {self.city}"
