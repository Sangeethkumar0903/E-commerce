from django.urls import path
from .views import ProductListView, SellerProductView, SellerProductDetailView, CategoryListView

urlpatterns = [
    path('browse/', ProductListView.as_view()),
    path('seller/products/', SellerProductView.as_view()),
    path('seller/products/<int:pk>/', SellerProductDetailView.as_view()),
    path('categories/', CategoryListView.as_view()),


]
