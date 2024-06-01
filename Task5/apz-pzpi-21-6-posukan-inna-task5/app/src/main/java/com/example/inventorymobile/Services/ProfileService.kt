package com.example.inventorymobile.service

import com.example.inventorymobile.Connection.ConnectionClass
import com.example.inventorymobile.Data.UserData
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.SQLException

class ProfileService(private val connectionClass: ConnectionClass) {

    fun fetchProfileData(userEmail: String): UserData {
        var profileData = UserData("Undefined", "Undefined", "Undefined")
        val connection: Connection? = connectionClass.connectToSQL()
        try {
            if (connection != null) {
                val query = "SELECT FirstName, LastName, PhoneNumber FROM [User] WHERE email = ?"
                val preparedStatement: PreparedStatement = connection.prepareStatement(query)
                preparedStatement.setString(1, userEmail)
                val resultSet = preparedStatement.executeQuery()
                if (resultSet.next()) {
                    val firstName = resultSet.getString("FirstName") ?: "Undefined"
                    val lastName = resultSet.getString("LastName") ?: "Undefined"
                    val phoneNumber = resultSet.getString("PhoneNumber") ?: "Undefined"
                    profileData = UserData(firstName, lastName, phoneNumber)
                }
                resultSet.close()
                preparedStatement.close()
            }
        } catch (e: SQLException) {
            e.printStackTrace()
        } finally {
            connection?.close()
        }
        return profileData
    }

    fun updateUserData(userEmail: String, newFirstName: String, newLastName: String, newPhoneNumber: String): Boolean {
        val connection: Connection? = connectionClass.connectToSQL()
        return try {
            if (connection != null) {
                val query = "UPDATE [User] SET FirstName = ?, LastName = ?, PhoneNumber = ? WHERE email = ?"
                val preparedStatement: PreparedStatement = connection.prepareStatement(query)
                preparedStatement.setString(1, newFirstName)
                preparedStatement.setString(2, newLastName)
                preparedStatement.setString(3, newPhoneNumber)
                preparedStatement.setString(4, userEmail)
                preparedStatement.executeUpdate()
                preparedStatement.close()
                true
            } else {
                false
            }
        } catch (e: SQLException) {
            e.printStackTrace()
            false
        } finally {
            connection?.close()
        }
    }
}
