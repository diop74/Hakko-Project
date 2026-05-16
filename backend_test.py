#!/usr/bin/env python3
"""
HAAKO Platform Backend API Testing
Tests all API endpoints for the French energy research platform
"""

import requests
import sys
from datetime import datetime
import json

class HAAKOAPITester:
    def __init__(self, base_url="https://haako-energy.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_base}/{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        if headers:
            request_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.headers.get('content-type', '').startswith('application/json'):
                    try:
                        response_data = response.json()
                        if isinstance(response_data, dict):
                            print(f"   Response keys: {list(response_data.keys())}")
                        elif isinstance(response_data, list):
                            print(f"   Response: List with {len(response_data)} items")
                    except:
                        pass
            else:
                self.tests_passed += 1 if response.status_code in [200, 201, 204] else 0
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}")
                    
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url
                })

            return success, response

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'url': url
            })
            return False, None
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'url': url
            })
            return False, None

    def test_health_endpoints(self):
        """Test health and root endpoints"""
        print("\n" + "="*50)
        print("🏥 TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test health endpoint
        self.run_test("Health Check", "GET", "health", 200)

    def test_articles_endpoints(self):
        """Test public articles endpoints"""
        print("\n" + "="*50)
        print("📰 TESTING ARTICLES ENDPOINTS")
        print("="*50)
        
        # Test get all articles
        self.run_test("Get All Articles", "GET", "articles", 200)
        
        # Test articles with pagination
        self.run_test("Get Articles (Page 1)", "GET", "articles?page=1&limit=5", 200)
        
        # Test articles by category
        self.run_test("Get Articles by Category", "GET", "articles?category=articles", 200)
        
        # Test articles by theme
        self.run_test("Get Articles by Theme", "GET", "articles?theme=energie", 200)
        
        # Test articles count
        self.run_test("Get Articles Count", "GET", "articles/count", 200)
        
        # Test articles count with filters
        self.run_test("Get Articles Count (Filtered)", "GET", "articles/count?category=analyses", 200)
        
        # Test get article by slug (expect 404 since no articles exist)
        self.run_test("Get Article by Slug", "GET", "articles/non-existent-slug", 404)

    def test_contact_endpoints(self):
        """Test contact form endpoints"""
        print("\n" + "="*50)
        print("📧 TESTING CONTACT ENDPOINTS")
        print("="*50)
        
        # Test contact form submission
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "organization": "Test Organization",
            "subject": "Test Message",
            "message": "This is a test message for the HAAKO platform."
        }
        
        success, response = self.run_test("Submit Contact Form", "POST", "contact", 200, contact_data)
        
        return success

    def test_auth_endpoints(self):
        """Test authentication endpoints (should fail without auth)"""
        print("\n" + "="*50)
        print("🔐 TESTING AUTH ENDPOINTS")
        print("="*50)
        
        # Test get current user (should require auth)
        self.run_test("Get Current User (No Auth)", "GET", "auth/me", 401)
        
        # Test logout (should work even without auth)
        self.run_test("Logout", "POST", "auth/logout", 200)
        
        # Test session exchange (should fail without session_id)
        self.run_test("Exchange Session (No Data)", "POST", "auth/session", 400)

    def test_admin_endpoints(self):
        """Test admin endpoints (should all require authentication)"""
        print("\n" + "="*50)
        print("🔒 TESTING ADMIN ENDPOINTS (Should Require Auth)")
        print("="*50)
        
        # Test admin articles (should require auth)
        self.run_test("Get Admin Articles (No Auth)", "GET", "admin/articles", 401)
        
        # Test admin stats (should require auth)
        self.run_test("Get Admin Stats (No Auth)", "GET", "admin/stats", 401)
        
        # Test admin messages (should require auth)
        self.run_test("Get Admin Messages (No Auth)", "GET", "admin/messages", 401)
        
        # Test create article (should require auth)
        article_data = {
            "title": "Test Article",
            "slug": "test-article",
            "excerpt": "Test excerpt",
            "content": "Test content",
            "category": "articles",
            "theme": "energie",
            "tags": ["test"],
            "status": "draft"
        }
        self.run_test("Create Article (No Auth)", "POST", "admin/articles", 401, article_data)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 HAAKO Platform Backend API Testing")
        print("=" * 60)
        print(f"Testing Base URL: {self.base_url}")
        print(f"API Base URL: {self.api_base}")
        print("=" * 60)
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_articles_endpoints()
        self.test_contact_endpoints()
        self.test_auth_endpoints()
        self.test_admin_endpoints()
        
        # Print final results
        self.print_results()

    def print_results(self):
        """Print final test results"""
        print("\n" + "="*60)
        print("📊 FINAL TEST RESULTS")
        print("="*60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS ({len(self.failed_tests)}):")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"{i}. {test['name']}")
                if 'expected' in test and 'actual' in test:
                    print(f"   Expected: {test['expected']}, Got: {test['actual']}")
                if 'error' in test:
                    print(f"   Error: {test['error']}")
                print(f"   URL: {test['url']}")
                print()
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = HAAKOAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())