package com.dailyplate.app.services

import com.google.firebase.firestore.FirebaseFirestore

class FirestoreSeeder {

    fun seedRestaurants() {
        val db = FirebaseFirestore.getInstance()

        val restaurantsData = listOf(
            hashMapOf(
                "name" to "Sharma Kitchen",
                "rating" to 4.5,
                "cuisines" to listOf("North Indian", "Thali"),
                "delivery_time" to "25-30 min",
                "image_url" to "https://images.unsplash.com/photo-1626777553767-463df4740f95",
                "is_homemade" to true
            ),
            hashMapOf(
                "name" to "Fresh Bites Cafe",
                "rating" to 4.3,
                "cuisines" to listOf("Healthy", "Salads", "Wraps"),
                "delivery_time" to "25-30 min",
                "image_url" to "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
                "is_homemade" to false
            ),
            hashMapOf(
                "name" to "Mama's Home Food",
                "rating" to 4.8,
                "cuisines" to listOf("Home-Made", "Comfort Food"),
                "delivery_time" to "30-35 min",
                "image_url" to "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
                "is_homemade" to true
            )
        )

        val batch = db.batch()
        val col = db.collection("restaurants")

        restaurantsData.forEach {
            val ref = col.document()
            batch.set(ref, it)
        }

        batch.commit()
            .addOnSuccessListener {
                println("Batch Seed Success!")
            }
            .addOnFailureListener {
                println("Batch Seed Error: $it")
            }
    }
}
