package com.example.inventorymobile

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import com.example.inventorymobile.Connection.ConnectionClass
import com.example.inventorymobile.Data.StoreData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.sql.SQLException

class HomeFragment : Fragment() {
    private lateinit var connectionClass: ConnectionClass
    private lateinit var listViewStores: ListView
    private lateinit var storeAdapter: ArrayAdapter<StoreData>
    private val storeIds = mutableListOf<String>()
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        val activity = requireActivity() as MainActivity
        activity.setToolbarTitle("Your Shop")

        listViewStores = view.findViewById(R.id.listViewStores)
        connectionClass = ConnectionClass()
        sharedPreferences = requireContext().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)

        storeAdapter = object : ArrayAdapter<StoreData>(requireContext(), R.layout.item_shop, mutableListOf()) {
            override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                val itemView = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_shop, parent, false)
                val storeData = getItem(position)

                val storeNameTextView = itemView.findViewById<TextView>(R.id.textViewStoreName)
                val temperatureTextView = itemView.findViewById<TextView>(R.id.textViewTemperature)
                val humidityTextView = itemView.findViewById<TextView>(R.id.textViewHumidity)

                storeNameTextView.text = storeData?.storeName
                temperatureTextView.text = "Temperature: ${storeData?.temperature}°C"
                humidityTextView.text = "Humidity: ${storeData?.humidity}%"

                return itemView
            }
        }
        listViewStores.adapter = storeAdapter

        listViewStores.onItemClickListener = AdapterView.OnItemClickListener { _, _, position, _ ->
            val storeId = storeIds[position]
            navigateToProduct(storeId)
        }

        fetchStores()

        return view
    }

    private fun navigateToProduct(storeId: String) {
        val fragment = ProductFragment.newInstance(storeId)
        val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
        transaction.replace(R.id.frame_layout, fragment)
        transaction.addToBackStack(null)
        transaction.commit()
    }

    private fun getUserIdFromEmail(email: String): Int {
        var userId = -1
        val connection = connectionClass.connectToSQL()
        try {
            if (connection != null) {
                val query = "SELECT user_id FROM [User] WHERE email = ?"
                val preparedStatement = connection.prepareStatement(query)
                preparedStatement.setString(1, email)
                val resultSet = preparedStatement.executeQuery()
                if (resultSet.next()) {
                    userId = resultSet.getInt("user_id")
                }
            }
        } catch (e: SQLException) {
            Log.e("HomeFragment", "Error getting user ID from email: ${e.message}", e)
        } finally {
            connection?.close()
        }
        return userId
    }

    private fun saveUserIdToPrefs(userId: Int) {
        sharedPreferences.edit().putInt("user_id", userId).apply()
    }

    private fun fetchStores() {
        val email = sharedPreferences.getString("email", "") ?: ""
        val userId = getUserIdFromEmail(email)
        GlobalScope.launch(Dispatchers.IO) {
            val storesWithSensors = mutableListOf<StoreData>()
            if (userId == -1) {
                return@launch
            }

            val connection = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query =
                        "SELECT s.store_id, s.StoreName, se.temperature, se.humidity " +
                                "FROM store s " +
                                "JOIN sensor se ON s.store_id = se.store_id " +
                                "WHERE s.user_id = ?"
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setInt(1, userId)
                    val resultSet = preparedStatement.executeQuery()
                    while (resultSet.next()) {
                        val storeId = resultSet.getString("store_id")
                        val storeName = resultSet.getString("StoreName")
                        val temperature = resultSet.getDouble("temperature")
                        val humidity = resultSet.getDouble("humidity")
                        storesWithSensors.add(
                            StoreData(
                                storeId,
                                storeName,
                                temperature,
                                humidity
                            )
                        )
                    }
                }
            } catch (e: SQLException) {
                Log.e("HomeFragment", "Error fetching stores: ${e.message}", e)
            } finally {
                connection?.close()
            }
            withContext(Dispatchers.Main) {
                updateUI(storesWithSensors)
                saveUserIdToPrefs(userId)
            }
        }
    }

    private fun updateUI(storesWithSensors: List<StoreData>) {
        storeAdapter.clear()
        storeIds.clear()
        if (storesWithSensors.isNotEmpty()) {
            storesWithSensors.forEach { storeData ->
                storeAdapter.add(storeData)
                storeIds.add(storeData.storeId)
            }
        } else {
            Toast.makeText(requireContext(), "No stores found for user", Toast.LENGTH_LONG).show()
        }
        Log.i("User ID from SharedPreferences", getUserIdFromEmail(sharedPreferences.getString("email", "") ?: "").toString())
    }
}
