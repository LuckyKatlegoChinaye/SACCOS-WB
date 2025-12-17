
// Google Map initializer for Contact page
function init() {
    // Coordinates for Diamond Trading Company Botswana (DTCB) - Gaborone
    // Plot No. 63016, DTCB, Gaborone, Botswana
    const myLatlng = { lat: -24.6286, lng: 25.9136 };

    const mapOptions = {
        zoom: 15,
        center: myLatlng,
        scrollwheel: false,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [{ saturation: '32' }, { lightness: '-3' }, { visibility: 'on' }, { weight: '1.18' }]
            },
            {
                featureType: 'administrative',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
            },
            {
                featureType: 'landscape',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'all',
                stylers: [{ saturation: '-70' }, { lightness: '14' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'all',
                stylers: [{ saturation: '-70' }, { lightness: '15' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'all',
                stylers: [{ saturation: '-70' }, { lightness: '32' }]
            },
            {
                featureType: 'road.local',
                elementType: 'all',
                stylers: [{ saturation: '-70' }, { lightness: '30' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ saturation: '6' }, { lightness: '60' }]
            }
        ]
    };

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, mapOptions);

    // Custom marker with orange color
    const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Ditswammung SACCOS - DTCB Botswana',
        animation: google.maps.Animation.DROP
    });

    // Info window with detailed information
    const info = new google.maps.InfoWindow({
        content: `
            <div style="font-family: Arial, sans-serif; max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; color: #f86f2d; font-size: 16px;">Ditswammung SACCOS</h3>
                <p style="margin: 4px 0; color: #333; font-size: 13px;">
                    <strong>Location:</strong><br>
                    Plot No. 63016<br>
                    Diamond Trading Company Botswana (DTCB)<br>
                    Gaborone, Botswana
                </p>
                <p style="margin: 8px 0 4px 0; color: #333; font-size: 13px;">
                    <strong>Phone:</strong> (+267) 3649639/40
                </p>
                <p style="margin: 4px 0; color: #333; font-size: 13px;">
                    <strong>Fax:</strong> (+267) 3951150
                </p>
            </div>
        `
    });
    
    marker.addListener('click', () => info.open(map, marker));
    
    // Open info window by default
    info.open(map, marker);

    // Expose for debugging if needed
    window._ditsMap = { map, marker };
}

// Make init available as the callback for the Maps API
window.init = init;

// Track whether Google Maps init ran
window._gmapsInitialized = false;

// Mark initialized when Google calls init
const __wrapInit = window.init;
window.init = function() {
    try { __wrapInit(); } catch (e) { console.error('Google Maps init error', e); }
    window._gmapsInitialized = true;
    if (window._gmapsCheckTimer) {
        clearTimeout(window._gmapsCheckTimer);
        window._gmapsCheckTimer = null;
    }
};

// Leaflet fallback initializer (OpenStreetMap)
function initLeaflet() {
    if (window._leafletInitialized) return;
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded; cannot initialize fallback map.');
        // Show a friendly message in the map container
        const el = document.getElementById('map');
        if (el) el.innerHTML = '<div style="padding:24px">Map is unavailable. Please contact us for directions.</div>';
        return;
    }
    window._leafletInitialized = true;
    const coords = [-24.586117129118893, 25.91433281294054];
    // Remove any Google Maps error overlays that may have been injected
    const el = document.getElementById('map');
    if (el) {
        // Remove elements with the Google Maps error container class
        const gErr = el.querySelectorAll('.gm-err-container');
        gErr.forEach(node => node.remove());
        // Clear inline children to avoid conflicts
        el.innerHTML = '';
        el.style.position = 'relative';
    }

    const map = L.map('map').setView(coords, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const marker = L.marker(coords).addTo(map).bindPopup('<strong>Ditswammung SACCOS</strong><br>Plot No. 63016, DTCB, Gaborone').openPopup();
    window._ditsMap = { leafletMap: map, leafletMarker: marker };
}

// If Google doesn't call our init within a short timeout, fall back to Leaflet
window._gmapsCheckTimer = setTimeout(function() {
    if (!window._gmapsInitialized) {
        console.warn('Google Maps did not initialize in time — falling back to OpenStreetMap (Leaflet).');
        initLeaflet();
    }
}, 4000);

