from django.urls import path
from .views import CheckoutView, CustomerOrdersView, SellerOrdersView, UpdateOrderStatusView, AdminOrdersView, CancelOrderItemView

urlpatterns = [
    path('checkout/', CheckoutView.as_view()),
    path('my-orders/', CustomerOrdersView.as_view()),
    path('seller-orders/', SellerOrdersView.as_view()),
    path('seller/update-status/<int:order_item_id>/', UpdateOrderStatusView.as_view()),
    path('admin/all-orders/', AdminOrdersView.as_view()),
    path('cancel/<int:order_item_id>/', CancelOrderItemView.as_view()),





]
