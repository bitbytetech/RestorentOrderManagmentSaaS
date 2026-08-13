from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

def index(request):
    """
    RestroHub Production Landing Page View.
    Positioning: QR Ordering + Multi-Outlet Menu & Order Management for Growing Restaurants.
    Competitor Benchmarks: Toast, Petpooja, Posist.
    """
    demo_items = [
        {
            'id': 'item-1',
            'name': 'Paneer Tikka (Chef Special)',
            'category': 'Starters',
            'is_veg': True,
            'description': 'Cottage cheese cubes marinated in spiced yogurt and grilled in tandoor.',
            'image': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
            'variants': [
                {'name': 'Half Portion (4 Pcs)', 'price': 180, 'unit': 'half'},
                {'name': 'Full Portion (8 Pcs)', 'price': 310, 'unit': 'full'}
            ]
        },
        {
            'id': 'item-2',
            'name': 'Royal Awadhi Dum Biryani',
            'category': 'Main Course',
            'is_veg': False,
            'description': 'Slow-cooked fragrant Basmati rice layered with succulent marinated meat & saffron.',
            'image': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
            'variants': [
                {'name': 'Half Portion', 'price': 220, 'unit': 'half'},
                {'name': 'Full Portion', 'price': 390, 'unit': 'full'}
            ]
        },
        {
            'id': 'item-3',
            'name': 'Dal Makhani Handi',
            'category': 'Main Course',
            'is_veg': True,
            'description': 'Overnight slow-cooked black lentils enriched with butter and fresh cream.',
            'image': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
            'variants': [
                {'name': 'Half Handi', 'price': 150, 'unit': 'half'},
                {'name': 'Full Handi', 'price': 260, 'unit': 'full'}
            ]
        },
        {
            'id': 'item-4',
            'name': 'Pure Silver Kaju Katli',
            'category': 'Sweets & Bakery',
            'is_veg': True,
            'description': 'Premium cashew fudge prepared with pure desi ghee and edible silver leaf.',
            'image': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
            'variants': [
                {'name': '100 Grams', 'price': 120, 'unit': 'gram'},
                {'name': '250 Grams', 'price': 300, 'unit': 'gram'},
                {'name': '1000 Grams (1 Kg)', 'price': 1150, 'unit': 'kilogram'}
            ]
        }
    ]

    faqs = [
        {
            'q': 'Is the 100 Free Orders/Day Starter Plan really 100% free?',
            'a': 'Yes! RestroHub offers a lifetime free plan for 1 outlet handling up to 100 orders per day. 0% commission, 0 setup charges, and no credit card required.'
        },
        {
            'q': 'Do guests need to download an app to order?',
            'a': 'No app installation required! Guests simply scan the QR code using standard mobile browsers (Safari, Chrome) to explore the digital menu and place orders.'
        },
        {
            'q': 'How does Multi-Outlet Menu & Pricing Management work?',
            'a': 'RestroHub lets chain owners maintain a central master menu while setting store-specific price overrides, availability toggles, or cloning complete menus across outlets in 1 click.'
        },
        {
            'q': 'Can sweet shops & bakeries sell items by custom weight (100g, 250g, 1kg)?',
            'a': 'Absolutely! RestroHub supports weight-based units (gram, kilogram) as well as non-proportional portion pricing (Full ₹120 / Half ₹75).'
        },
        {
            'q': 'How does the Cashier Counter POS & Kitchen KOT integration work?',
            'a': 'Cashiers can quickly place walk-in orders, capture customer mobile numbers, record Cash/UPI payments, and trigger physical KOT prints directly to thermal printers.'
        }
    ]

    context = {
        'page_title': 'RestroHub — Manage Menus, Orders & Outlets from One Dashboard',
        'demo_items_json': json.dumps(demo_items),
        'demo_items': demo_items,
        'faqs': faqs,
        'city_launch': 'Lucknow'
    }
    return render(request, 'landing/index.html', context)


def demo_menu(request):
    """
    Live Interactive Demo Menu Simulation Page (scanned via QR).
    """
    return render(request, 'landing/demo_menu.html', {
        'brand_name': 'RestroHub',
        'outlet_name': 'Royal Awadhi Cuisine — Hazratganj',
        'table_number': 'T4',
    })


@require_POST
def quick_signup(request):
    """
    Frictionless 1-Minute Owner Signup Handler.
    """
    try:
        data = json.loads(request.body) if request.content_type == 'application/json' else request.POST
        brand_name = data.get('brand_name')
        owner_name = data.get('owner_name')
        mobile = data.get('mobile')
        city = data.get('city', 'Lucknow')

        if not brand_name or not owner_name or not mobile:
            return JsonResponse({'success': False, 'message': 'Please fill all required fields.'}, status=400)

        return JsonResponse({
            'success': True,
            'message': f'Congratulations {owner_name}! Your RestroHub free account for "{brand_name}" ({city}) with 100 Free Daily Orders has been created. Redirecting to dashboard...',
            'redirect_url': '/#signup-success'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
