// ไฟล์ทดสอบ API endpoints
const endpoints = [
    '/api/wallpapers',
    '/api/wallpapers?isNew=true',
    '/api/wallpapers?isPopular=true',
    '/api/categories',
    '/api/slideshows',
    '/api/orders'
];

async function testEndpoints() {
    console.log('🧪 Testing API endpoints...\n');
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📍 Testing: ${endpoint}`);
            const response = await fetch(`http://localhost:3000${endpoint}`);
            const data = await response.json();
            
            console.log(`✅ Status: ${response.status}`);
            console.log(`📊 Type: ${Array.isArray(data) ? 'Array' : typeof data}`);
            console.log(`📏 Length: ${Array.isArray(data) ? data.length : 'N/A'}`);
            
            if (Array.isArray(data) && data.length > 0) {
                console.log('🔍 Sample:', JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('---\n');
    }
}

testEndpoints();
