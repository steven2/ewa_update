
import apolloClient1 from './apollo-client'
import { provideApolloClient } from "@vue/apollo-composable";

const apolloProvider = provideApolloClient(apolloClient1)

export default apolloProvider