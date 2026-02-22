package com.dailyplate.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity
import com.dailyplate.app.services.FirestoreSeeder
import com.google.firebase.FirebaseApp

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Firebase
        FirebaseApp.initializeApp(this)
        
        // Seed database on startup (for demo purposes)
        try {
            // Instantiate and seed
            FirestoreSeeder().seedRestaurants()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
