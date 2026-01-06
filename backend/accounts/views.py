from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, SellerProfileSerializer,AddressSerializer
from rest_framework.permissions import IsAdminUser
from .models import SellerProfile, Address
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import generics 


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data["role"] == "ADMIN":
            return Response(
                {"error": "Admin registration not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer.save()

        return Response(
            {"message": "Registered successfully"},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)

      
        if user.is_superuser:
            role = "ADMIN"
        elif user.role == "SELLER":
            role = "SELLER"
        else:
            role = "CUSTOMER"

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": role
        })
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "role": user.role
        })

    def put(self, request):
        user = request.user
        user.full_name = request.data.get("full_name", user.full_name)
        user.phone = request.data.get("phone", user.phone)
        user.save()

        return Response({"message": "Profile updated successfully"})

    
    

class SellerProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Get or create seller profile for the current user
        obj, created = SellerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'store_name': '',
                'gst_number': '',
                'pan_number': '',
                'bank_account': ''
            }
        )
        return obj
    
    def get(self, request, *args, **kwargs):
        try:
            profile = self.get_object()
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        
        # Prevent updates if already verified (unless admin)
        if profile.is_verified and not request.user.is_staff:
            return Response(
                {'error': 'Cannot update verified profile. Contact admin for changes.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(profile, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VerifySellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, seller_id):
        try:
            seller = SellerProfile.objects.get(id=seller_id)
            seller.is_verified = True
            seller.save()
            return Response({"message": "Seller verified successfully"})
        except SellerProfile.DoesNotExist:
            return Response({"error": "Seller not found"}, status=404)


class SellerStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "SELLER":
            return Response({"error": "Not allowed"}, status=403)

        seller = request.user.sellerprofile
        return Response({
            "store_name": seller.store_name,
            "is_verified": seller.is_verified
        })

class AdminSellerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        sellers = SellerProfile.objects.all()
        data = [
            {
                "id": s.id,
                "store_name": s.store_name,
                "email": s.user.email,
                "is_verified": s.is_verified
            }
            for s in sellers
        ]
        return Response(data)

class AddressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "CUSTOMER":
            return Response(
                {"error": "Only customers can access addresses"},
                status=status.HTTP_403_FORBIDDEN
            )

        addresses = Address.objects.filter(
            customer=request.user.customerprofile
        )
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != "CUSTOMER":
            return Response(
                {"error": "Only customers can add addresses"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            customer=request.user.customerprofile
        )
        return Response(serializer.data, status=201)

class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        if request.user.role != "CUSTOMER":
            return Response({"error": "Not allowed"}, status=403)

        address = Address.objects.get(
            id=id,
            customer=request.user.customerprofile
        )

        # handle default address
        if request.data.get("is_default"):
            Address.objects.filter(
                customer=request.user.customerprofile,
                is_default=True
            ).update(is_default=False)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, id):
        if request.user.role != "CUSTOMER":
            return Response({"error": "Not allowed"}, status=403)

        Address.objects.get(
            id=id,
            customer=request.user.customerprofile
        ).delete()
        return Response({"message": "Address deleted"})
