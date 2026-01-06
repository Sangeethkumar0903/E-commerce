from django.contrib import admin
from .models import Category, Product, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent', 'is_active')
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'seller', 'price', 'stock_quantity', 'is_active')
    list_filter = ('is_active', 'seller')
    inlines = [ProductImageInline]
