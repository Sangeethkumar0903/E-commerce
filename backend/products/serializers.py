from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image_url']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, source='productimage_set', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['seller']



