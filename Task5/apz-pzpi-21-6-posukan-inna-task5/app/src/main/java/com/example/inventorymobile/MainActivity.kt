package com.example.inventorymobile

import android.content.Context
import android.os.AsyncTask
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.inventorymobile.Connection.ConnectionClass
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException

class MainActivity : AppCompatActivity() {
    private lateinit var connectionClass: ConnectionClass
    private lateinit var textViewUserId: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        textViewUserId = findViewById(R.id.textViewUserId)

        connectionClass = ConnectionClass()

        FetchUserIdTask().execute()
    }

    private fun getEmailFromSharedPreferences(): String? {
        val sharedPreferences = getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        val email = sharedPreferences.getString("email", null)
        return email
    }

    private fun saveUserIdToPrefs(userId: String) {
        val sharedPreferences = getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("user_id", userId)
            apply()
        }
    }

    private fun getUserIdFromPrefs(): String? {
        val sharedPreferences = getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        return sharedPreferences.getString("user_id", null)
    }

    inner class FetchUserIdTask : AsyncTask<Void, Void, String?>() {
        override fun doInBackground(vararg params: Void?): String? {
            var userId: String? = null
            val email = getEmailFromSharedPreferences()
            if (email.isNullOrEmpty()) {
                return null
            }

            val connection: Connection? = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = "SELECT user_id FROM [User] WHERE email = ?"
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, email)
                    val resultSet: ResultSet = preparedStatement.executeQuery()
                    if (resultSet.next()) {
                        userId = resultSet.getString("user_id")
                    }
                    resultSet.close()
                    preparedStatement.close()
                }
            } catch (e: SQLException) {
                e.printStackTrace()
            } finally {
                connection?.close()
            }
            return userId
        }

        override fun onPostExecute(userId: String?) {
            super.onPostExecute(userId)
            if (userId != null) {
                Log.d("MainActivity", "UserId: $userId")
                saveUserIdToPrefs(userId)
                Toast.makeText(this@MainActivity, "UserId: $userId", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(this@MainActivity, "Failed to fetch userId", Toast.LENGTH_LONG).show()
            }
        }
    }


    override fun onResume() {
        super.onResume()
        val savedUserId = getUserIdFromPrefs()
        if (savedUserId != null) {
            textViewUserId.text = savedUserId
        }
    }
}
