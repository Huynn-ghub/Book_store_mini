from rest_framework import serializers
from books.models import Book, Category
from books.validate.validate_create_book import vaidate_create_book

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = '__all__'


class BookListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = Book
        fields = '__all__'

    def validate(self, attrs):
        # Kết hợp dữ liệu cũ (khi update/PATCH)
        validate_data = {}
        if self.instance:
            validate_data['title']          = self.instance.title
            validate_data['author']         = self.instance.author
            validate_data['published_date'] = self.instance.published_date
            validate_data['price']          = self.instance.price
            validate_data['quantity']       = self.instance.quantity

        for key, value in attrs.items():
            validate_data[key] = value

        errors = vaidate_create_book(validate_data)
        if errors:
            raise serializers.ValidationError(errors)
        return attrs
