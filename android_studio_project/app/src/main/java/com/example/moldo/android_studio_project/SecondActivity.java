package com.example.moldo.android_studio_project;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class SecondActivity extends AppCompatActivity {
    RequestQueue queue;
    List<String> list_data_array;
    ArrayAdapter adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        queue = Volley.newRequestQueue(this);
        initAdapter();
        load_list_view();
    }

    private void request_new_data()
    {
        String url = "http://192.168.43.242:16000/api/listdata2";
        JSONObject jsonReq= new JSONObject();
        try {
            jsonReq.put("arr", "arr");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.POST, url, jsonReq, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println("Response: " + response.toString());
                        JSONArray arr;
                        try {
                            arr = response.getJSONArray("data");
                            System.out.println("Got array: "+ arr);
                            reloadListViewWithJsonArr(arr);
                            setListData(arr.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Toast.makeText(getApplicationContext(), "No internet connection!",
                                Toast.LENGTH_LONG).show();
                        System.out.println(error.toString());
                    }
                });
        this.queue.add(jsonObjectRequest);
    }

    private void reloadListViewWithJsonArr(JSONArray arr) {
        list_data_array.clear();
        String text, importance;
        for(int i=0; i<arr.length(); ++i)
        {
            JSONObject obj = null;
            try {
                obj = arr.getJSONObject(i);
                text = obj.getString("text");
                importance = obj.getString("importance");
                list_data_array.add(text + "  | Importance: " + importance);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        System.out.println("New data loaded!");
        System.out.println(list_data_array.toString());
        adapter.notifyDataSetChanged();
    }

    private void initAdapter() {
        list_data_array = new ArrayList<String>();
        list_data_array.add("Nothing");
        adapter = new ArrayAdapter<String>(this,
                R.layout.activity_listview, list_data_array);

        ListView listView = (ListView) findViewById(R.id.data_list_view);
        listView.setAdapter(adapter);
    }

    private void load_list_view() {
        String localListData = getListData();
        if (!localListData.equals(""))
        {
            System.out.println("We have local data. Will load it before getting data from server!");
            try {
                JSONArray x = new JSONArray(localListData);
                reloadListViewWithJsonArr(x);
                System.out.println("Loaded local data");
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        request_new_data();
    }

    public void refreshButton(View view) {
        System.out.println("Refresh pressed!");
        load_list_view();
        System.out.println("Refresh button done!");
    }

    private String getListData() {
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        String listData = sharedPref.getString("list_data","");
        System.out.println("Got list data: " + listData);
        return listData;
    }

    private void setListData(String lsitData) {
        System.out.println("Will set list data "+ lsitData);
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("list_data", lsitData);
        editor.commit();
    }

}
