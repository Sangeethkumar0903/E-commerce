from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer, CategorySerializer, Category, ProductImageSerializer
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
import rest_framework.status as status



class ProductListView(APIView):
    def get(self, request):
        # Filter products
        products = Product.objects.filter(
            is_active=True,
            stock_quantity__gt=0,
            seller__is_verified=True
        )
        
        # Setup pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        
        # Paginate the filtered queryset
        result_page = paginator.paginate_queryset(products, request)
        
        # Serialize only the paginated results
        serializer = ProductSerializer(result_page, many=True)
        
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)
    
class SellerProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'SELLER':
            return Response({"error": "Not allowed"}, status=403)

        seller = request.user.sellerprofile
        
        # Debug counts
        all_products = Product.objects.filter(seller=seller)
        active_products = all_products.filter(is_active=True)
        
        print(f"🔍 Seller {seller.store_name}: {all_products.count()} total, {active_products.count()} active")
        
        # List all products
        for p in all_products:
            print(f"  - {p.id}: {p.title} | Active: {p.is_active}")
        
        # Return only active products
        serializer = ProductSerializer(active_products, many=True)
        return Response(serializer.data)

    def post(self, request):
        seller = request.user.sellerprofile
        if not seller.is_verified:
            return Response({"error": "Seller not verified"}, status=403)

        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seller=seller,is_active=True)
        return Response(serializer.data, status=201)
    
class SellerProductDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'SELLER':
            return Product.objects.none()
        # Only allow access to ACTIVE products
        return Product.objects.filter(
            seller=self.request.user.sellerprofile,
            is_active=True
        )

    def perform_update(self, serializer):
        seller = self.request.user.sellerprofile
        if not seller.is_verified:
            raise PermissionError("Seller not verified")
        serializer.save()

    def perform_destroy(self, instance):
        # Soft delete - set is_active to False
        instance.is_active = False
        instance.save()
        print(f"✅ Product {instance.id} soft-deleted (is_active=False)")


class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class ProductImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        product = Product.objects.get(id=product_id, seller=request.user.sellerprofile)
        image = request.FILES.get("image")

        # FIX: Use ProductImage model, not serializer
        ProductImage.objects.create(
            product=product,
            image_url=image
        )
        return Response({"message": "Image uploaded"})
