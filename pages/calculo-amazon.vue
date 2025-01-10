<template>
  <div>
    <PageHero title="Calculo de Importación desde Amazon" />

    <b-field grouped>
      <b-field>
        <b-checkbox v-model="useParams">
          {{ useParams }}
        </b-checkbox>
      </b-field>

      <b-button
        label="Agregar Orden"
        type="is-link"
        icon-left="account-search"
        @click.prevent="addOrder"
      />
    </b-field>

    <div
      class="box"
      v-for="(order, orderKey) in orders"
    >

      <!-- Header -->
      <div class="columns is-mobile is-1 is-variable has-background-info-light">
        <div class="column is-3">
          <b-field
            label="Shipping Total"
            label-position="inside"
            expanded
          >
            <b-input
              v-model.number="order.totalShipping"
              type="number"
              placeholder="125"
            ></b-input>
          </b-field>
        </div>
        <div class="column is-3">
          <b-field
            label="Order Total"
            label-position="inside"
            expanded
          >
            <b-input
              type="number"
              :value="orderTotal(order)"
              readonly
              placeholder="00.00"
            ></b-input>
          </b-field>
        </div>
        <div class="column is-3">
          <b-field
            label="Rate"
            label-position="inside"
            expanded
          >
            <b-input
              type="number"
              v-model.number="exchangeRate"
              placeholder="00.00"
              :readonly="useParams"
            ></b-input>
          </b-field>
        </div>
      </div>


      <!-- Rows -->
      <div
        class="columns is-multiline is-mobile is-1 is-variable"
        v-for="(item, key) in order.items"
        :class="{ 'has-background-light': key % 2 !== 0, 'custom-row': true }"
      >
        <div class="column is-3">
          <b-field
            label="Name"
            label-position="inside"
          >
            <b-input
              v-model="item.name"
              type="text"
              expanded
            ></b-input>
          </b-field>
        </div>
        <div class="column is-3">
          <b-field
            label="Price"
            label-position="inside"
          >
            <b-input
              v-model.number="item.price"
              type="number"
              expanded
            ></b-input>
          </b-field>
        </div>
        <div class="column is-5">

          <b-field
            grouped
            group-multiline
          >
            <div class="control mb-1">
              <b-taglist attached>
                <b-tag
                  type="is-dark"
                  size="is-medium"
                >Total</b-tag>
                <b-tag
                  type="is-info"
                  size="is-medium"
                >Q{{ item.total }}</b-tag>
                <b-tag
                  type="is-success"
                  size="is-medium"
                >{{ item.percentage }}%</b-tag>
              </b-taglist>
            </div>
          </b-field>
          <b-field
            grouped
            group-multiline
          >
            <div class="control">
              <b-taglist attached>
                <b-tag type="is-dark">&#x1F4B2;</b-tag>
                <b-tag type="is-link">Q{{ item.actualPrice }}</b-tag>

                <b-tag type="is-dark">&#x1F4B8;</b-tag>
                <b-tag type="is-link">Q{{ item.actualFee }}</b-tag>

                <b-tag type="is-dark">&#x1F69A;</b-tag>
                <b-tag type="is-link">Q{{ item.shipping }}</b-tag>
              </b-taglist>
            </div>
          </b-field>

        </div>
        <div class="column is-1">
          <b-button
            type="is-danger"
            icon-left="minus"
            @click="removeItem(order, key)"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="columns is-mobile is-1 is-variable">
        <div class="column is-half">
          <div class="buttons">
            <b-button
              type="is-success"
              icon-left="file-plus"
              @click="addItem(order)"
            >
            </b-button>
            <b-button
              type="is-danger"
              icon-left="trash-can-outline"
              @click="removeOrder(orderKey)"
            />
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script
  lang="ts"
  setup
>
import { type Item, type Params, type Order } from '~/types/amazon'

const useParams = ref(true)
const orders = ref<Array<Order>>([])
const exchangeRate = ref(7.8)
const params = computed((): Params => ({
  fee: useParams.value ? 0.03 : 0,
  minimumFee: useParams.value ? 20 : 0
}))

const addOrder = () => {
  const newOrder: Order = {
    items: [] as Array<Item>,
    totalShipping: 0.0
  }

  orders.value.push(newOrder)
}

const addItem = (order: Order) => {
  order.items.push({
    name: `Item-${order.items.length + 1}`,
    percentage: 0.0,
    price: 0.0,
    total: 0.0,
    fee: 0.0,
    shipping: 0.0,
    actualPrice: 0.0,
    actualFee: 0.0,
  })
}

const removeItem = (order: Order, index: number) => {
  order.items.splice(index, 1)
}

const removeOrder = (index: number) => {
  orders.value.splice(index, 1)
}

const orderTotal = (order: Order) => {
  return roundUp(order.items.reduce((acc, item) => acc + item.total, 0))
}


const itemPercentage = (orderTotal: number, item: Item) => {
  return roundUp((item.actualPrice / orderTotal) * 100)
}

const calculateOrder = (order: Order) => {
  let totalFee = 0
  let totalOrder = 0
  //order.total = 0

  order.items.forEach((item) => {
    if (item.price === 0) {
      return
    }
    item.actualPrice = roundUp(item.price * exchangeRate.value)
    const itemFee = item.actualPrice * params.value.fee
    item.fee = roundUp(Math.max(params.value.minimumFee, itemFee))

    totalFee += +item.fee
    totalOrder += +item.actualPrice
  })

  order.items.forEach((item) => {
    if (item.price === 0) {
      return
    }
    item.percentage = itemPercentage(totalOrder, item)
    item.shipping = roundUp(order.totalShipping * (item.percentage / 100))
    item.actualFee = roundUp(totalFee * (item.percentage / 100))

    item.total = roundUp(item.actualPrice + item.actualFee + item.shipping)
    //order.total = order.total + item.total
  })
}

const isUpdating = ref(false)
watch(orders.value as Array<Order>, (newOrders: Array<Order>) => {
  updateOrders(newOrders)
}, { deep: true })

watch(useParams, (newUseParams: boolean) => {
  updateOrders()
})

watch(exchangeRate, (newExchangeRate: number) => {
  updateOrders()
})

const updateOrders = (o: Array<Order> = orders.value) => {
  if (isUpdating.value) {
    return
  }
  isUpdating.value = true
  o.forEach((order) => {
    calculateOrder(order)
  })
  isUpdating.value = false
}

</script>

<style>
.columns:not(:last-child) {
  margin-bottom: 0.5rem !important;
}
</style>
