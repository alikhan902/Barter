from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsNotAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return not request.user or not request.user.is_authenticated
    
class IsOwnerOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user