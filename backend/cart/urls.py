from django.urls import path
from .views import AddToCartView, CartView, UpdateCartItemView, DeleteCartItemView

urlpatterns = [
    path("", CartView.as_view()),   
    path('add/', AddToCartView.as_view()),
    path("update/<int:item_id>/", UpdateCartItemView.as_view()),
    path("delete/<int:item_id>/", DeleteCartItemView.as_view()),
]
