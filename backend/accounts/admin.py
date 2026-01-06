from django.contrib import admin
from .models import User, CustomerProfile, SellerProfile
from django.utils import timezone

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active')
    search_fields = ('email',)

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')

@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'is_verified', 'created_at', 'verified_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('store_name', 'gst_number', 'pan_number', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['verify_profiles', 'unverify_profiles']
    
    def verify_profiles(self, request, queryset):
        updated = queryset.update(is_verified=True, verified_at=timezone.now())
        self.message_user(request, f'{updated} profiles verified successfully.')
    
    verify_profiles.short_description = "Verify selected profiles"
    
    def unverify_profiles(self, request, queryset):
        updated = queryset.update(is_verified=False, verified_at=None)
        self.message_user(request, f'{updated} profiles unverified.')
    
    unverify_profiles.short_description = "Unverify selected profiles"


# Register your models here.
