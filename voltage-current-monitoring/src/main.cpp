/**
 * PZEM SENSOR 
 * Author nath@2006
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

// --- Konfigurasi Wi-Fi Hotspot ---
const char* ssid = "DINASTI_RPL";
const char* password = "jaya1234";

// --- Konfigurasi MQTT (Mosquitto) ---
const char* mqtt_server = "192.168.1.103"; 
const int mqtt_port = 1883;

// --- Inisialisasi Hardware & Library ---
#define PZEM_RX_PIN 16  
#define PZEM_TX_PIN 17  

PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
    // Loop until we're reconnected
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        // Create a random client ID
        String clientId = "ESP32Client-PZEM";
        
        // Attempt to connect
        if (client.connect(clientId.c_str())) {
            Serial.println("connected to Mosquitto");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("PZEM-004T V3.0 Power Meter - ESP32 to MQTT");

    setup_wifi();
    client.setServer(mqtt_server, mqtt_port);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop(); // Pertahankan koneksi MQTT

    // Membaca data dari sensor PZEM
    float voltage   = pzem.voltage();
    float current   = pzem.current();
    float power     = pzem.power();
    float energy    = pzem.energy();
    float frequency = pzem.frequency();
    float pf        = pzem.pf();

    // Validasi pembacaan sensor
    if(isnan(voltage) || isnan(current) || isnan(power) || isnan(energy) || isnan(frequency) || isnan(pf)){
        Serial.println("Error reading data from PZEM sensor");
    } else {
        // Format data menjadi JSON agar mudah dibaca oleh Node.js
        String jsonPayload = "{";
        jsonPayload += "\"voltage\":" + String(voltage) + ",";
        jsonPayload += "\"current\":" + String(current) + ",";
        jsonPayload += "\"power\":" + String(power) + ",";
        jsonPayload += "\"energy\":" + String(energy, 3) + ",";
        jsonPayload += "\"frequency\":" + String(frequency) + ",";
        jsonPayload += "\"pf\":" + String(pf);
        jsonPayload += "}";

        // Print ke Serial Monitor
        Serial.print("Publishing data: ");
        Serial.println(jsonPayload);

        // Publish ke MQTT Broker dengan topik "pzem/data"
        client.publish("pzem/data", jsonPayload.c_str());
    }

    delay(2000);
}
