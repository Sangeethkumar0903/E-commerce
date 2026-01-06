from django.urls import path
from .views import RegisterView, LoginView, SellerProfileUpdateView, VerifySellerView, SellerStatusView, AdminSellerListView, AddressView, UserProfileView, AddressDetailView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('seller/profile/', SellerProfileUpdateView.as_view()),
    path('admin/verify-seller/<int:seller_id>/', VerifySellerView.as_view()),
    path("seller/status/", SellerStatusView.as_view()),
    path("admin/sellers/", AdminSellerListView.as_view()),
    path("addresses/", AddressView.as_view()),
    path("profile/", UserProfileView.as_view()),
    path("addresses/<int:id>/", AddressDetailView.as_view()),






]
