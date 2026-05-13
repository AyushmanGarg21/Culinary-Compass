"""Script to populate the database with dummy data for testing."""
import os
import sys
from datetime import datetime, date, timedelta
from uuid import uuid4
import random

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models.base import Base
from app.models.country import Country
from app.models.city import City
from app.models.meal import Meal , MealType
from app.models.ingredient import Ingredient, IngredientType
from app.models.user import User
from app.models.admin import Admin
from app.models.auth_provider import AuthProvider
from app.models.user_auth_identity import UserAuthIdentity
from app.models.creator_request import CreatorRequest, CreatorRequestStatus
from app.models.creator_post import CreatorPost, CreatorPostStatus
from app.models.meal_planner import MealPlanner
from app.models.follow import Follow
from app.models.user_message import UserMessage
from app.models.admin_message import AdminMessage, AdminMessageSender
from app.services.authService import AuthService


# def create_tables():
#     """Create all database tables."""
#     print("Creating database tables...")
#     Base.metadata.create_all(bind=engine)
#     print("✅ Tables created successfully!")


def populate_countries_and_cities(db: Session):
    """Populate countries and cities."""
    print("Populating countries and cities...")
    
    countries_data = [
        {"name": "United States", "code": "US", "phone_code": "+1"},
        {"name": "Canada", "code": "CA", "phone_code": "+1"},
        {"name": "United Kingdom", "code": "GB", "phone_code": "+44"},
        {"name": "India", "code": "IN", "phone_code": "+91"},
        {"name": "Australia", "code": "AU", "phone_code": "+61"},
        {"name": "Germany", "code": "DE", "phone_code": "+49"},
        {"name": "France", "code": "FR", "phone_code": "+33"},
        {"name": "Italy", "code": "IT", "phone_code": "+39"},
        {"name": "Spain", "code": "ES", "phone_code": "+34"},
        {"name": "Mexico", "code": "MX", "phone_code": "+52"},
    ]
    
    cities_data = {
        "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
        "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
        "United Kingdom": ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
        "India": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
        "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
        "Germany": ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt"],
        "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
        "Italy": ["Rome", "Milan", "Naples", "Turin", "Florence"],
        "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao"],
        "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
    }
    
    for country_data in countries_data:
        country = Country(**country_data)
        db.add(country)
        db.flush()
        
        # Add cities for this country
        for city_name in cities_data[country_data["name"]]:
            city = City(name=city_name, country_id=country.id)
            db.add(city)
    
    db.commit()
    print("✅ Countries and cities populated!")


def populate_meals_and_ingredients(db: Session):
    """Populate meals and ingredients."""
    print("Populating meals and ingredients...")

    # BREAKFAST = "Breakfast"
    # BRUNCH = "Brunch"
    # ELEVENSES = "Elevenses"
    # LUNCH = "Lunch"
    # AFTERNOON_TEA = "Afternoon Tea"
    # HIGH_TEA = "High Tea"
    # DINNER = "Dinner"
    # SUPPER = "Supper"
    # MIDNIGHT_SNACK = "Midnight Snack"
    
    meals_data = [
        {"meal_type": MealType.BREAKFAST, "icon": "🥞", "meal_name": "Pancakes with Syrup", "calories": 350},
        {"meal_type": MealType.BREAKFAST, "icon": "🍳", "meal_name": "Scrambled Eggs", "calories": 200},
        {"meal_type": MealType.BREAKFAST, "icon": "🥣", "meal_name": "Oatmeal with Berries", "calories": 250},
        {"meal_type": MealType.BREAKFAST, "icon": "🥐", "meal_name": "Croissant with Coffee", "calories": 300},
        {"meal_type": MealType.LUNCH, "icon": "🥗", "meal_name": "Caesar Salad", "calories": 400},
        {"meal_type": MealType.LUNCH, "icon": "🍕", "meal_name": "Margherita Pizza", "calories": 550},
        {"meal_type": MealType.LUNCH, "icon": "🍔", "meal_name": "Grilled Chicken Burger", "calories": 500},
        {"meal_type": MealType.LUNCH, "icon": "🍜", "meal_name": "Chicken Noodle Soup", "calories": 300},
        {"meal_type": MealType.DINNER, "icon": "🍝", "meal_name": "Spaghetti Carbonara", "calories": 600},
        {"meal_type": MealType.DINNER, "icon": "🥩", "meal_name": "Grilled Steak", "calories": 700},
        {"meal_type": MealType.DINNER, "icon": "🍛", "meal_name": "Chicken Curry with Rice", "calories": 650},
        {"meal_type": MealType.DINNER, "icon": "🐟", "meal_name": "Baked Salmon", "calories": 450},
        {"meal_type": MealType.SUPPER, "icon": "🥪", "meal_name": "Turkey Sandwich", "calories": 350},
        {"meal_type": MealType.SUPPER, "icon": "🍲", "meal_name": "Vegetable Soup", "calories": 250},
        {"meal_type": MealType.SUPPER, "icon": "🍣", "meal_name": "Sushi Platter", "calories": 400},
        {"meal_type": MealType.SUPPER, "icon": "🌮", "meal_name": "Fish Tacos", "calories": 450},
        {"meal_type": MealType.MIDNIGHT_SNACK, "icon": "🍪", "meal_name": "Chocolate Chip Cookies", "calories": 150},
        {"meal_type": MealType.MIDNIGHT_SNACK, "icon": "🍦", "meal_name": "Vanilla Ice Cream", "calories": 200},
        {"meal_type": MealType.MIDNIGHT_SNACK, "icon": "🍩", "meal_name": "Glazed Donut", "calories": 250},
        {"meal_type": MealType.MIDNIGHT_SNACK, "icon": "🍫", "meal_name": "Chocolate Bar", "calories": 220},
        {"meal_type": MealType.BRUNCH, "icon": "🥓", "meal_name": "Bacon and Eggs", "calories": 450},
        {"meal_type": MealType.BRUNCH, "icon": "🥞", "meal_name": "Blueberry Pancakes", "calories": 400},
        {"meal_type": MealType.BRUNCH, "icon": "🍳", "meal_name": "Eggs Benedict", "calories": 500},
        {"meal_type": MealType.BRUNCH, "icon": "🥐", "meal_name": "Ham and Cheese Croissant", "calories": 350},
        {"meal_type": MealType.AFTERNOON_TEA, "icon": "🍰", "meal_name": "Strawberry Shortcake", "calories": 300},
        {"meal_type": MealType.AFTERNOON_TEA, "icon": "🫖", "meal_name": "Earl Grey Tea with Scones", "calories": 250},
        {"meal_type": MealType.HIGH_TEA, "icon": "🍵", "meal_name": "Green Tea with Matcha Cookies", "calories": 200},
        {"meal_type": MealType.HIGH_TEA, "icon": "🍪", "meal_name": "Assorted Tea Cookies", "calories": 350},
    ]
    
    for meal_data in meals_data:
        meal = Meal(**meal_data)
        db.add(meal)
    
    ingredients_data = [
        {"name": "Chicken", "type": IngredientType.Protein, "emoji": "🍗"},
        {"name": "Beef", "type": IngredientType.Protein, "emoji": "🥩"},
        {"name": "Pork", "type": IngredientType.Protein, "emoji": "🍖"},
        {"name": "Fish", "type": IngredientType.Protein, "emoji": "🐟"},
        {"name": "Eggs", "type": IngredientType.Protein, "emoji": "🥚"},
        {"name": "Milk", "type": IngredientType.Dairy, "emoji": "🥛"},
        {"name": "Cheese", "type": IngredientType.Dairy, "emoji": "🧀"},
        {"name": "Butter", "type": IngredientType.Dairy, "emoji": "🧈"},
        {"name": "Tomatoes", "type": IngredientType.Vegetables, "emoji": "🍅"},
        {"name": "Onions", "type": IngredientType.Vegetables, "emoji": "🧅"},
        {"name": "Garlic", "type": IngredientType.Vegetables, "emoji": "🧄"},
        {"name": "Bell Peppers", "type": IngredientType.Vegetables, "emoji": "🫑"},
        {"name": "Carrots", "type": IngredientType.Vegetables, "emoji": "🥕"},
        {"name": "Potatoes", "type": IngredientType.Vegetables, "emoji": "🥔"},
        {"name": "Rice", "type": IngredientType.Grains, "emoji": "🍚"},
        {"name": "Pasta", "type": IngredientType.Grains, "emoji": "🍝"},
        {"name": "Bread", "type": IngredientType.Grains, "emoji": "🍞"},
        {"name": "Flour", "type": IngredientType.Grains, "emoji": "🌾"},
        {"name": "Olive Oil", "type": IngredientType.Grains, "emoji": "🫒"},
        {"name": "Salt", "type": IngredientType.Grains, "emoji": "🧂"},
        {"name": "Pepper", "type": IngredientType.Grains, "emoji": "🌶️"},
        {"name": "Basil", "type": IngredientType.Vegetables, "emoji": "🌿"},
        {"name": "Oregano", "type": IngredientType.Vegetables, "emoji": "🌿"},
        {"name": "Thyme", "type": IngredientType.Vegetables, "emoji": "🌿"},
        {"name": "Parsley", "type": IngredientType.Vegetables, "emoji": "🌿"},
        {"name": "Lemon", "type": IngredientType.Vegetables, "emoji": "🍋"},
        {"name": "Lime", "type": IngredientType.Vegetables, "emoji": "🍈"},
        {"name": "Ginger", "type": IngredientType.Vegetables, "emoji": "🫚"}
    ]
    
    for ingredient_data in ingredients_data:
        ingredient = Ingredient(**ingredient_data)
        db.add(ingredient)
    
    db.commit()
    print("✅ Meals and ingredients populated!")


def populate_auth_providers(db: Session):
    """Populate authentication providers."""
    print("Populating auth providers...")
    
    providers = [
        {"provider_name": "email", "provider_type": "credentials"},
        {"provider_name": "admin", "provider_type": "credentials"},
        {"provider_name": "google", "provider_type": "oauth"},
        {"provider_name": "facebook", "provider_type": "oauth"},
    ]
    
    for provider_data in providers:
        provider = AuthProvider(**provider_data)
        db.add(provider)
    
    db.commit()
    print("✅ Auth providers populated!")


def populate_admin_users(db: Session):
    """Populate admin users."""
    print("Populating admin users...")
    
    admin_data = [
        {
            "id": str(uuid4()),
            "name": "Super Admin",
            "email": "admin@foodieapp.com",
            "password": AuthService.hash_password("admin123"),
            "is_active": True
        },
        {
            "id": str(uuid4()),
            "name": "Content Admin",
            "email": "content@foodieapp.com",
            "password": AuthService.hash_password("content123"),
            "is_active": True
        }
    ]
    
    for admin_info in admin_data:
        admin = Admin(**admin_info)
        db.add(admin)
    
    db.commit()
    print("✅ Admin users populated!")


def populate_users(db: Session):
    """Populate regular users and creators."""
    print("Populating users...")
    
    # Get some countries and cities for users
    countries = db.query(Country).all()
    cities = db.query(City).all()
    email_provider = db.query(AuthProvider).filter(AuthProvider.provider_name == "email").first()
    
    users_data = [
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone_no": "+1234567890",
            "gender": "Male",
            "age": 28,
            "height": 175,
            "weight": 70,
            "calories_target": 2000,
            "about_me": "Fitness enthusiast and food lover",
            "is_creator": False
        },
        {
            "name": "Maria Lopez",
            "email": "maria.lopez@example.com",
            "phone_no": "+1234567891",
            "gender": "Female",
            "age": 32,
            "height": 165,
            "weight": 60,
            "calories_target": 1800,
            "about_me": "Professional chef with 10 years experience. Loves painting and hiking in the mountains.",
            "is_creator": True
        },
        {
            "name": "David Chen",
            "email": "david.chen@example.com",
            "phone_no": "+1234567892",
            "gender": "Male",
            "age": 25,
            "height": 180,
            "weight": 75,
            "calories_target": 2200,
            "about_me": "Software developer who loves cooking Asian cuisine",
            "is_creator": True
        },
        {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@example.com",
            "phone_no": "+1234567893",
            "gender": "Female",
            "age": 29,
            "height": 170,
            "weight": 65,
            "calories_target": 1900,
            "about_me": "Nutritionist and wellness coach",
            "is_creator": False
        },
        {
            "name": "Ahmed Hassan",
            "email": "ahmed.hassan@example.com",
            "phone_no": "+1234567894",
            "gender": "Male",
            "age": 35,
            "height": 178,
            "weight": 80,
            "calories_target": 2100,
            "about_me": "Middle Eastern cuisine specialist",
            "is_creator": True
        },
        {
            "name": "Emma Wilson",
            "email": "emma.wilson@example.com",
            "phone_no": "+1234567895",
            "gender": "Female",
            "age": 26,
            "height": 168,
            "weight": 58,
            "calories_target": 1700,
            "about_me": "Vegan food blogger and recipe creator",
            "is_creator": True
        }
    ]
    
    created_users = []
    
    for i, user_data in enumerate(users_data):
        # Assign random country and city
        country = random.choice(countries)
        city = random.choice([c for c in cities if c.country_id == country.id])
        
        user = User(
            id=str(uuid4()),
            country_id=country.id,
            city_id=city.id,
            **user_data
        )
        db.add(user)
        db.flush()
        
        # Create auth identity
        auth_identity = UserAuthIdentity(
            id=str(uuid4()),
            user_id=user.id,
            provider_id=email_provider.id,
            email=user_data["email"],
            phone_no=user_data["phone_no"],
            password_hash=AuthService.hash_password("password123")
        )
        db.add(auth_identity)
        created_users.append(user)
    
    db.commit()
    print("✅ Users populated!")
    return created_users


def populate_creator_requests(db: Session, users):
    """Populate creator requests."""
    print("Populating creator requests...")
    
    # Create some pending creator requests from non-creator users
    non_creators = [u for u in users if not u.is_creator]
    
    for user in non_creators[:2]:  # First 2 non-creators
        creator_request = CreatorRequest(
            user_id=user.id,
            about_self=f"I'm {user.name} and I'm passionate about cooking. I have been cooking for my family for years.",
            experience="5+ years of home cooking experience, specializing in comfort food and healthy meals.",
            links=["https://instagram.com/mycooking", "https://youtube.com/mykitchen"],
            status=CreatorRequestStatus.PENDING
        )
        db.add(creator_request)
    
    db.commit()
    print("✅ Creator requests populated!")


def populate_creator_posts(db: Session, users):
    """Populate creator posts."""
    print("Populating creator posts...")
    
    creators = [u for u in users if u.is_creator]
    
    posts_data = [
        {
            "title": "Perfect Spaghetti Carbonara",
            "overview": "A classic Italian pasta dish with eggs, cheese, and pancetta",
            "cooking_time": 20,
            "cuisine_type": "Italian",
            "servings": 4,
            "ingredients": ["spaghetti", "eggs", "parmesan cheese", "pancetta", "black pepper"],
            "instructions": "1. Cook spaghetti al dente. 2. Fry pancetta until crispy. 3. Mix eggs and cheese. 4. Combine everything off heat.",
            "status": CreatorPostStatus.APPROVED
        },
        {
            "title": "Healthy Buddha Bowl",
            "overview": "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
            "cooking_time": 35,
            "cuisine_type": "Mediterranean",
            "servings": 2,
            "ingredients": ["quinoa", "sweet potato", "chickpeas", "kale", "tahini", "lemon"],
            "instructions": "1. Cook quinoa. 2. Roast vegetables. 3. Massage kale. 4. Make tahini dressing. 5. Assemble bowl.",
            "status": CreatorPostStatus.APPROVED
        },
        {
            "title": "Spicy Thai Green Curry",
            "overview": "Authentic Thai curry with coconut milk and fresh herbs",
            "cooking_time": 30,
            "cuisine_type": "Thai",
            "servings": 4,
            "ingredients": ["green curry paste", "coconut milk", "chicken", "thai basil", "fish sauce"],
            "instructions": "1. Fry curry paste. 2. Add coconut milk. 3. Add chicken and vegetables. 4. Simmer until cooked.",
            "status": CreatorPostStatus.PENDING
        }
    ]
    
    for i, post_data in enumerate(posts_data):
        creator = creators[i % len(creators)]
        post = CreatorPost(
            user_id=creator.id,
            **post_data
        )
        db.add(post)
    
    db.commit()
    print("✅ Creator posts populated!")


def populate_meal_plans(db: Session, users):
    """Populate meal plans."""
    print("Populating meal plans...")
    
    meals = db.query(Meal).all()
    
    # Create meal plans for the past week and next week
    for user in users[:3]:  # First 3 users
        for days_offset in range(-7, 8):  # Past week + today + next week
            plan_date = date.today() + timedelta(days=days_offset)
            
            # Create 3-4 meals per day
            meal_types = ["Breakfast", "Lunch", "Dinner"]
            if random.choice([True, False]):
                meal_types.append("Snack")
            
            for meal_type in meal_types:
                # 70% chance of regular meal, 30% chance of custom meal
                if random.random() < 0.7:
                    # Regular meal
                    available_meals = [m for m in meals if m.meal_type == meal_type]
                    if available_meals:
                        meal = random.choice(available_meals)
                        meal_plan = MealPlanner(
                            user_id=user.id,
                            date=plan_date,
                            meal_type=meal_type,
                            meal_id=meal.id,
                            is_marked_done=random.choice([True, False]) if days_offset <= 0 else False,
                            is_custom_meal=False
                        )
                        db.add(meal_plan)
                else:
                    # Custom meal
                    custom_meals = {
                        "Breakfast": [("Avocado Toast", "320"), ("Smoothie Bowl", "280")],
                        "Lunch": [("Quinoa Salad", "450"), ("Wrap", "380")],
                        "Dinner": [("Stir Fry", "520"), ("Soup", "300")],
                        "Snack": [("Protein Bar", "200"), ("Fruit", "100")]
                    }
                    
                    custom_name, custom_calories = random.choice(custom_meals[meal_type])
                    meal_plan = MealPlanner(
                        user_id=user.id,
                        date=plan_date,
                        meal_type=meal_type,
                        custom_meal_name=custom_name,
                        custom_calories=custom_calories,
                        is_marked_done=random.choice([True, False]) if days_offset <= 0 else False,
                        is_custom_meal=True
                    )
                    db.add(meal_plan)
    
    db.commit()
    print("✅ Meal plans populated!")


def populate_follows(db: Session, users):
    """Populate follow relationships."""
    print("Populating follows...")
    
    creators = [u for u in users if u.is_creator]
    regular_users = [u for u in users if not u.is_creator]
    
    # Regular users follow creators
    for user in regular_users:
        # Follow 2-3 random creators
        followed_creators = random.sample(creators, min(3, len(creators)))
        for creator in followed_creators:
            follow = Follow(
                following_user_id=user.id,
                followed_user_id=creator.id
            )
            db.add(follow)
    
    # Some creators follow each other
    for creator in creators:
        other_creators = [c for c in creators if c.id != creator.id]
        if other_creators:
            followed = random.sample(other_creators, min(2, len(other_creators)))
            for other_creator in followed:
                follow = Follow(
                    following_user_id=creator.id,
                    followed_user_id=other_creator.id
                )
                db.add(follow)
    
    db.commit()
    print("✅ Follows populated!")


def populate_messages(db: Session, users):
    """Populate user messages and admin messages."""
    print("Populating messages...")
    
    creators = [u for u in users if u.is_creator]
    regular_users = [u for u in users if not u.is_creator]
    
    # User to creator messages
    for user in regular_users:
        for creator in creators[:2]:  # Message first 2 creators
            # User sends message to creator
            message1 = UserMessage(
                sender_id=user.id,
                recevier_id=creator.id,
                content=f"Hi {creator.name}! I love your recipes. Can you share more details about your cooking techniques?",
                is_read=True
            )
            db.add(message1)
            
            # Creator replies
            message2 = UserMessage(
                sender_id=creator.id,
                recevier_id=user.id,
                content=f"Thank you {user.name}! I'm glad you enjoy my recipes. I'd be happy to share more tips with you.",
                is_read=False
            )
            db.add(message2)
    
    # Admin messages
    for user in users[:3]:  # First 3 users have admin conversations
        # User sends message to admin
        admin_msg1 = AdminMessage(
            user_id=user.id,
            sender=AdminMessageSender.User,
            content="I'm having trouble with my account settings. Can you help me?",
            is_read=True
        )
        db.add(admin_msg1)
        
        # Admin replies
        admin_msg2 = AdminMessage(
            user_id=user.id,
            sender=AdminMessageSender.Admin,
            content="Hello! I'd be happy to help you with your account settings. What specific issue are you experiencing?",
            is_read=False
        )
        db.add(admin_msg2)
    
    db.commit()
    print("✅ Messages populated!")


def main():
    """Main function to populate all dummy data."""
    print("🚀 Starting dummy data population...")
    
    # Create tables
    # create_tables()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Populate data in order (respecting foreign key constraints)
        # populate_countries_and_cities(db)
        # populate_meals_and_ingredients(db)
        # populate_auth_providers(db)
        # populate_admin_users(db)
        users = populate_users(db)
        populate_creator_requests(db, users)
        populate_creator_posts(db, users)
        populate_meal_plans(db, users)
        populate_follows(db, users)
        populate_messages(db, users)
        
        print("\n🎉 Dummy data population completed successfully!")
        print("\n📋 Summary:")
        print(f"   • Countries: {db.query(Country).count()}")
        print(f"   • Cities: {db.query(City).count()}")
        print(f"   • Meals: {db.query(Meal).count()}")
        print(f"   • Ingredients: {db.query(Ingredient).count()}")
        print(f"   • Users: {db.query(User).count()}")
        print(f"   • Admins: {db.query(Admin).count()}")
        print(f"   • Creator Requests: {db.query(CreatorRequest).count()}")
        print(f"   • Creator Posts: {db.query(CreatorPost).count()}")
        print(f"   • Meal Plans: {db.query(MealPlanner).count()}")
        print(f"   • Follows: {db.query(Follow).count()}")
        print(f"   • User Messages: {db.query(UserMessage).count()}")
        print(f"   • Admin Messages: {db.query(AdminMessage).count()}")
        
        print("\n🔑 Test Credentials:")
        print("   Admin:")
        print("     Email: admin@foodieapp.com")
        print("     Password: admin123")
        print("   Users:")
        print("     Email: john.doe@example.com")
        print("     Email: maria.lopez@example.com")
        print("     Email: david.chen@example.com")
        print("     Password: password123 (for all users)")
        
    except Exception as e:
        print(f"❌ Error during population: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()