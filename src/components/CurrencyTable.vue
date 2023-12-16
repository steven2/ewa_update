<template>
    <v-container>
    <v-responsive class="align-center text-center fill-height">
          <VCard title="Recent Devices">
    <VCardText>
      Table - Apollo
    </VCardText>
   <v-container>   
        <div v-if="loading">Loading...</div>
      </v-container>  
  <v-data-table
    ref="CurrencyTable"
    theme="dark" 
    v-if="result && result.Currency2" 
    :headers="headers"
    :items="result.Currency2"
    :sort-by="[{ key: 'currency_id', order: 'asc' }]"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Manage Currencies</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.currency_id"
                      label="Currency id"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.symbol"
                      label="Symbol"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
        </VCard>
    </v-responsive>
  </v-container>
  
</template>
<script>
  import { watch } from "vue";
  import { useQuery } from "@vue/apollo-composable";
  import { provideApolloClient } from "@vue/apollo-composable";
  import { gql } from "graphql-tag";
  import { useMutation } from "@vue/apollo-composable"
  import { INSERT_CURRENCY_ONE, UPDATE_CURRENCY_BY_PK, DELETE_CURRENCY_BY_PK } from "../graphql-operations"

  import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
  } from "@apollo/client/core";
  //  import { apolloProvider } from "../plugins";

  export default {
 
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'EWA Currency',
          align: 'start',
          sortable: true,
          key: 'currency_id',
        },
        { title: 'Description', key: 'description' },
        { title: 'Symbol', key: 'symbol' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      currencies: [],
      editedIndex: -1,
      editedItem: {
        currency_id: '',
        description: '',
        symbol: '',
      },
      defaultItem: {
        currency_id: '',
        description: '',
        symbol: '',
      },
    
  }),

  methods: {
      initialize () {
      
      },

      editItem (item) {
        this.editedIndex = this.result.Currency2.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.result.Currency2.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        // this.result.Currency2.splice(this.editedIndex, 1)
        this.deleteC(this.editedIndex, 1);
        //this.$refs.CurrencyTable.reload();
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          //Object.assign(this.result.Currency2[this.editedIndex], this.editedItem)
          this.editC(this.editedItem);
        } else {
          // this.result.Currency2.push(this.editedItem)
          this.insertC(this.editedItem);
        }
        this.close()
      },

      insertC(items) {
        var element = {"__typename": "Currency2"};
        // add element to the object items
        items = Object.assign(items, element);
        const result = this.insertCurrency(items)
        //this.$apollo.queries.Currency2.refetch()
        console.log("Insert completed result", result)

      },

      editC(items) {
        var element = {"__typename": "Currency2"};
        // add element to the object items
        items = Object.assign(items, element);
        const result = this.updateCurrency(items)
        console.log("Update completed result", result)

      },

      deleteC(item) {
        var oKey = this.result.Currency2[item].currency_id;
        const result = this.deleteCurrency( {currency_id: oKey })
        console.log("Delete completed result", result)

      },   
      
    },

     setup() {

    const token = 'etocr5knAOXscScx3OKeFgZgcR4obKe5lwOYCQSpdVpO767xraBZVm0gupQF9YkF';
    // HTTP connection to the API
    const httpLink = createHttpLink({
      // You should use an absolute URL here
      uri: "https://ewa-23.hasura.app/v1/graphql",
          headers: {
           // Authorization: token ? `Bearer ${token}` : '',
             'x-hasura-admin-secret': token,
          },
    });


    // Cache implementation
    const cache = new InMemoryCache();

    // Create the apollo client
    const apolloClient = new ApolloClient({
      // token: token,
      link: httpLink,
      cache,
    });

    const my_currency = gql`
      query {
        Currency2 {
          currency_id
          description
          symbol
        }
      }
    `;

    const { result, loading } = provideApolloClient(apolloClient)(() =>
      useQuery(my_currency)
    ); // { data, loading, error }

    watch(result, (value) => {
      console.log(value, "OK");
    });

    // Insert Currency
    const { mutate: insertCurrency } = provideApolloClient(apolloClient)(() =>
    // const { mutate: insertCurrency } = apolloProvider(() =>
      useMutation(INSERT_CURRENCY_ONE, {

        update: (cache, { data: { insert_Currency2_one } }) => {  
          let data = cache.readQuery({ query: my_currency })
          var variables = insert_Currency2_one;
          data = {
            ...data,
            Currency2: [
              ...data.Currency2,
              variables,
            ],
          }
          cache.writeQuery({ query: my_currency, data })
        }  
      
      }
    
    ));

    // Edit Currency
    const { mutate: updateCurrency } = provideApolloClient(apolloClient)(() =>
     useMutation(UPDATE_CURRENCY_BY_PK , 
        {

            update(cache, { data: { update_Currency2_by_pk } }) {
              const existingCurrencies = cache.readQuery({ query: my_currency });
              const newCurrencies = existingCurrencies.Currency2.map((t) => {

                if (t.currency_id === update_Currency2_by_pk.currency_id) {
                  return update_Currency2_by_pk ;
                } else {
                  return t;
                }
              });
              cache.writeQuery({
                query: my_currency,
                data: {Currency2: newCurrencies}
              });
            },

        }

     )); 

    // Delete Currency
    const { mutate: deleteCurrency } = provideApolloClient(apolloClient)(() =>
      useMutation(DELETE_CURRENCY_BY_PK , 
        {

          update: (cache, { data }) => {
              cache.modify({
                  fields: {
                      Currency2: (existingCurrencies, { readField }) => {
                          return existingCurrencies.filter(
                              (CurrenciesRef) => data.delete_Currency2_by_pk.currency_id !== readField("currency_id", CurrenciesRef)
                          )
                      },
                  },
              })
          },

        }
       
    ));


    return {
      result,
      loading,
      insertCurrency,
      updateCurrency,
      deleteCurrency,
    };
  },
    
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    
  }



</script>