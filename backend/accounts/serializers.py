from rest_framework import serializers
from .models import User, CustomerProfile, SellerProfile
from django.contrib.auth import authenticate
from .models import Address

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "full_name", "phone", "role"]

    def create(self, validated_data):
     role = validated_data.pop("role")
     password = validated_data.pop("password")

     email = validated_data.pop("email")
     full_name = validated_data.pop("full_name", "")
     phone = validated_data.pop("phone", "")

  
     user = User.objects.create_user(
         email=email,
         password=password
     )

   
     user.full_name = full_name
     user.phone = phone
     user.role = role
     user.save()

 
     if role == "CUSTOMER":
        CustomerProfile.objects.get_or_create(user=user)
     elif role == "SELLER":
        SellerProfile.objects.get_or_create(user=user)

     return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            email=data['email'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = [
            'id',
            'store_name',
            'gst_number',
            'pan_number',
            'bank_account',
            'is_verified',
            'verified_at',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'verified_at', 'created_at', 'updated_at']
    
    def validate_gst_number(self, value):
        if len(value) != 15:
            raise serializers.ValidationError("GST number must be 15 characters long")
        return value
    
    def validate_pan_number(self, value):
        if len(value) != 10:
            raise serializers.ValidationError("PAN number must be 10 characters long")
        return value




class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "full_name",
            "phone",
            "address_line",
            "city",
            "state",
            "pincode",
            "is_default",
        ]
