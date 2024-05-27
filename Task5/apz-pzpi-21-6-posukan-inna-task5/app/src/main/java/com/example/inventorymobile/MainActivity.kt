package com.example.inventorymobile

import android.os.AsyncTask
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.inventorymobile.Connection.ConnectionClass
import java.sql.Connection

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        DatabaseConnectionTask().execute()
    }

    private inner class DatabaseConnectionTask : AsyncTask<Void, Void, Connection?>() {
        override fun doInBackground(vararg params: Void?): Connection? {
            val connectionClass = ConnectionClass()
            return connectionClass.connectToSQL()
        }

        override fun onPostExecute(connection: Connection?) {
            if (connection != null) {
                Toast.makeText(this@MainActivity, "Database connected successfully", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(this@MainActivity, "Failed to connect to the database", Toast.LENGTH_LONG).show()
            }
        }
    }
}
