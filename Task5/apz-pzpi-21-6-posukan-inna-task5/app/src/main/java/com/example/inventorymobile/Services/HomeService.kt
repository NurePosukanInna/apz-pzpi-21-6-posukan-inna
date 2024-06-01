package com.example.inventorymobile.service

import android.util.Log
import com.example.inventorymobile.Connection.ConnectionClass
import com.example.inventorymobile.Data.StoreData
import java.sql.Connection
import java.sql.SQLException

class HomeService(private val connectionClass: ConnectionClass) {

    fun getUserIdFromEmail(email: String): Int {
        var userId = -1
        val connection: Connection? = connectionClass.connectToSQL()
        try {
            if (connection != null) {
                val query = "SELECT user_id FROM [User] WHERE email = ?"
                val preparedStatement = connection.prepareStatement(query)
                preparedStatement.setString(1, email)
                val resultSet = preparedStatement.executeQuery()
                if (resultSet.next()) {
                    userId = resultSet.getInt("user_id")
                }
                resultSet.close()
                preparedStatement.close()
            }
        } catch (e: SQLException) {
            Log.e("DatabaseService", "Error getting user ID from email: ${e.message}", e)
        } finally {
            connection?.close()
        }
        return userId
    }

    fun fetchStores(userId: Int): List<StoreData> {
        val storesWithSensors = mutableListOf<StoreData>()
        val connection: Connection? = connectionClass.connectToSQL()
        try {
            if (connection != null) {
                val query = """
                    SELECT s.store_id, s.StoreName, se.temperature, se.humidity 
                    FROM store s 
                    JOIN sensor se ON s.store_id = se.store_id 
                    WHERE s.user_id = ?
                """
                val preparedStatement = connection.prepareStatement(query)
                preparedStatement.setInt(1, userId)
                val resultSet = preparedStatement.executeQuery()
                while (resultSet.next()) {
                    val storeId = resultSet.getString("store_id")
                    val storeName = resultSet.getString("StoreName")
                    val temperature = resultSet.getDouble("temperature")
                    val humidity = resultSet.getDouble("humidity")
                    storesWithSensors.add(StoreData(storeId, storeName, temperature, humidity))
                }
                resultSet.close()
                preparedStatement.close()
            }
        } catch (e: SQLException) {
            Log.e("DatabaseService", "Error fetching stores: ${e.message}", e)
        } finally {
            connection?.close()
        }
        return storesWithSensors
    }
}
