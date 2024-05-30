package com.example.inventorymobile

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.inventorymobile.Connection.ConnectionClass
import java.security.MessageDigest
import java.sql.Connection
import java.sql.ResultSet
import java.util.Base64

class LoginActivity : AppCompatActivity() {

    private var connection: Connection? = null
    private lateinit var sharedPreferences: SharedPreferences

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val emailEditText: EditText = findViewById(R.id.emailEditText)
        val passwordEditText: EditText = findViewById(R.id.passwordEditText)
        val loginButton: Button = findViewById(R.id.loginButton)
        val connectionClass = ConnectionClass()

        sharedPreferences = getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)

        loginButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            Thread {
                connection = connectionClass.connectToSQL()
                if (connection == null) {
                    Log.e("ConSql", "Failed to connect to the database.")
                } else {
                    val loginSuccessful = login(email, hashPassword(password))
                    if (loginSuccessful) {
                        saveEmailToPrefs(email)
                        Log.d("ConSql", "Login successful. Welcome!")
                        val intent = Intent(this@LoginActivity, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Log.d("ConSql", "Login failed. Incorrect email or password.")
                    }
                }
            }.start()
        }
    }

    private fun login(email: String, hashedPassword: String): Boolean {
        val query = "SELECT * FROM [User] WHERE email = ? AND password = ?"
        return try {
            connection?.prepareStatement(query)?.use { statement ->
                statement.setString(1, email)
                statement.setString(2, hashedPassword)
                Log.d("ConSql", "Executing query: $query with email=$email and hashedPassword=$hashedPassword (parameters substituted)")
                val rs: ResultSet = statement.executeQuery()
                val loginSuccess = rs.next()
                Log.d("ConSql", "Login success: $loginSuccess")
                loginSuccess
            } ?: false
        } catch (e: Exception) {
            Log.e("ConSql", "Error logging in: " + e.message, e)
            false
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun hashPassword(password: String): String {
        return try {
            val messageDigest = MessageDigest.getInstance("SHA-256")
            val hashedBytes = messageDigest.digest(password.toByteArray())
            Base64.getEncoder().encodeToString(hashedBytes)
        } catch (e: Exception) {
            Log.e("ConSql", "Error hashing password: " + e.message, e)
            ""
        }
    }

    private fun saveEmailToPrefs(email: String) {
        with(sharedPreferences.edit()) {
            putString("email", email)
            apply()
        }
    }

    override fun onResume() {
        super.onResume()
        val savedEmail = getEmailFromPrefs()
        Log.d("ConSql", "Email from SharedPreferences: $savedEmail")
    }

    private fun getEmailFromPrefs(): String {
        return sharedPreferences.getString("email", "") ?: ""
    }
}
