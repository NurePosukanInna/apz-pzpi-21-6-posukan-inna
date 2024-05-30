package com.example.inventorymobile

import android.content.Context
import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.inventorymobile.Connection.ConnectionClass
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException

class HomeFragment : Fragment() {
    private lateinit var connectionClass: ConnectionClass
    private lateinit var listViewStores: ListView
    private lateinit var storeAdapter: ArrayAdapter<String>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
        ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        listViewStores = view.findViewById(R.id.listViewStores)

        connectionClass = ConnectionClass()

        storeAdapter = ArrayAdapter(requireContext(), R.layout.item_shop, R.id.textViewStoreName, mutableListOf())
        listViewStores.adapter = storeAdapter

        FetchUserIdTask().execute()

        return view
    }

    private fun getEmailFromSharedPreferences(): String? {
        val sharedPreferences = requireActivity().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        return sharedPreferences.getString("email", null)
    }

    private fun getUserIdFromPrefs(): String? {
        val sharedPreferences = requireActivity().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        return sharedPreferences.getString("user_id", null)
    }

    inner class FetchUserIdTask : AsyncTask<Void, Void, List<String>>() {
        override fun doInBackground(vararg params: Void?): List<String> {
            val stores = mutableListOf<String>()
            val userId = getUserIdFromPrefs()
            if (userId.isNullOrEmpty()) {
                return stores
            }

            val connection: Connection? = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = "SELECT * FROM store WHERE user_id = ?"
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, userId)
                    val resultSet: ResultSet = preparedStatement.executeQuery()
                    while (resultSet.next()) {
                        val storeName = resultSet.getString("StoreName")
                        stores.add(storeName)
                    }
                    resultSet.close()
                    preparedStatement.close()
                }
            } catch (e: SQLException) {
                e.printStackTrace()
            } finally {
                connection?.close()
            }
            return stores
        }

        override fun onPostExecute(stores: List<String>) {
            super.onPostExecute(stores)
            storeAdapter.clear()
            if (stores.isNotEmpty()) {
                storeAdapter.addAll(stores)
            } else {
                Toast.makeText(requireContext(), "No stores found for user", Toast.LENGTH_LONG).show()
            }
        }
    }
}
