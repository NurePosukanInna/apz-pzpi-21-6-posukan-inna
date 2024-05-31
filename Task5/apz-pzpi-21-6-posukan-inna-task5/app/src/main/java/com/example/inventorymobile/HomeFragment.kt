package com.example.inventorymobile

import android.content.Context
import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import com.example.inventorymobile.Connection.ConnectionClass
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException

class HomeFragment : Fragment() {
    private lateinit var connectionClass: ConnectionClass
    private lateinit var listViewStores: ListView
    private lateinit var storeAdapter: ArrayAdapter<String>
    private val storeIds = mutableListOf<String>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        listViewStores = view.findViewById(R.id.listViewStores)
        connectionClass = ConnectionClass()

        storeAdapter = ArrayAdapter(requireContext(), R.layout.item_shop, R.id.textViewStoreName, mutableListOf())
        listViewStores.adapter = storeAdapter

        listViewStores.onItemClickListener = AdapterView.OnItemClickListener { _, _, position, _ ->
            val storeId = storeIds[position]
            navigateToProduct(storeId)
        }

        FetchUserIdTask().execute()

        return view
    }

    private fun navigateToProduct(storeId: String) {
        val fragment = ProductFragment.newInstance(storeId)
        val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
        transaction.replace(R.id.frame_layout, fragment)
        transaction.addToBackStack(null)
        transaction.commit()
    }

    private fun getUserIdFromPrefs(): String? {
        val sharedPreferences = requireActivity().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)
        return sharedPreferences.getString("user_id", null)
    }

    inner class FetchUserIdTask : AsyncTask<Void, Void, List<Pair<String, String>>>() {
        override fun doInBackground(vararg params: Void?): List<Pair<String, String>> {
            val stores = mutableListOf<Pair<String, String>>()
            val userId = getUserIdFromPrefs()
            if (userId.isNullOrEmpty()) {
                return stores
            }

            val connection: Connection? = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = "SELECT store_id, StoreName FROM store WHERE user_id = ?"
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, userId)
                    val resultSet: ResultSet = preparedStatement.executeQuery()
                    while (resultSet.next()) {
                        val storeId = resultSet.getString("store_id")
                        val storeName = resultSet.getString("StoreName")
                        stores.add(Pair(storeId, storeName))
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

        override fun onPostExecute(stores: List<Pair<String, String>>) {
            super.onPostExecute(stores)
            storeAdapter.clear()
            storeIds.clear()
            if (stores.isNotEmpty()) {
                stores.forEach { (id, name) ->
                    storeAdapter.add(name)
                    storeIds.add(id)
                }
            } else {
                Toast.makeText(requireContext(), "No stores found for user", Toast.LENGTH_LONG).show()
            }
        }
    }
}
