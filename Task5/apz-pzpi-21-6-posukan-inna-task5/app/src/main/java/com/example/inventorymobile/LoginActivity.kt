package com.example.inventorymobile

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.inventorymobile.Connection.ConnectionClass
import com.example.inventorymobile.service.LoginService

class LoginActivity : AppCompatActivity() {

    private lateinit var authService: LoginService

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val emailEditText: EditText = findViewById(R.id.emailEditText)
        val passwordEditText: EditText = findViewById(R.id.passwordEditText)
        val loginButton: Button = findViewById(R.id.loginButton)
        val connectionClass = ConnectionClass()

        authService = LoginService(this, connectionClass)

        loginButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            Thread {
                val loginSuccessful = authService.login(email, password)
                runOnUiThread {
                    if (loginSuccessful) {
                        Log.d("LoginActivity", "Login successful. Welcome!")
                        val intent = Intent(this@LoginActivity, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Log.d("LoginActivity", "Login failed. Incorrect email or password.")
                    }
                }
            }.start()
        }
    }

    override fun onResume() {
        super.onResume()
        val savedEmail = authService.getEmailFromPrefs()
        Log.d("LoginActivity", "Email from SharedPreferences: $savedEmail")
    }
}
