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
      <div class="columns is-mobile is-1 is-variable">
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
              disabled
              placeholder="85.74"
            ></b-input>
          </b-field>
        </div>
      </div>


      <!-- Rows -->
      <div
        class="columns is-multiline is-mobile is-1 is-variable"
        v-for="(item, key) in order.items"
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
          <ul>
            <li>
              <b-field
                grouped
                group-multiline
              >
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">Total</b-tag>
                    <b-tag type="is-info">Q{{ itemTotal(order, item).total }}</b-tag>
                  </b-taglist>
                </div>
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">%</b-tag>
                    <b-tag type="is-info">{{ itemPercentage(order, item) }}</b-tag>
                  </b-taglist>
                </div>
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">Price</b-tag>
                    <b-tag type="is-info">Q{{ itemTotal(order, item).price }}</b-tag>
                  </b-taglist>
                </div>
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">Tax</b-tag>
                    <b-tag type="is-success">Q{{ itemTotal(order, item).fee }}</b-tag>
                  </b-taglist>
                </div>
                <div class="control">
                  <b-taglist attached>
                    <b-tag type="is-dark">Shipping</b-tag>
                    <b-tag type="is-primary">Q{{ itemTotal(order, item).shipping }}</b-tag>
                  </b-taglist>
                </div>
              </b-field>
            </li>
          </ul>

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
import type { Item, ItemTotal, Order } from '~/types/amazon'

const useParams = ref(true)
const params = computed(() => ({
  fee: useParams.value ? 0.03 : 0,
  minimumFee: useParams.value ? 20 : 0,
  exchangeRate: 7.7 //useParams.value ? 7.78 : 7.6
}))

const orders = ref<Array<Order>>([])

const addOrder = () => {
  let newOrder: Order = {
    items: [],
    totalShipping: 0.0,
  }

  orders.value.push(newOrder)
}

const addItem = (order: Order) => {
  let newItem: Item = {
    name: "",
    price: 0.0,
  }

  order.items.push(newItem)
}

const removeItem = (order: Order, index: number) => {
  order.items.splice(index, 1)
}

const removeOrder = (index: number) => {
  orders.value.splice(index, 1)
}

const orderTotal = (order: Order) => {
  let total = 0
  order.items.forEach((item) => {
    total += +item.price
  })

  return roundUp(+total)
}

const itemPercentage = (order: Order, item: Item) => {
  return roundUp((item.price / orderTotal(order)) * 100)
}

const itemShipping = (order: Order, item: Item) => {
  return roundUp(order.totalShipping * (itemPercentage(order, item) / 100))
}

const itemTotal = (order: Order, item: Item): ItemTotal => {

  const result: ItemTotal = {
    price: roundUp(item.price * params.value.exchangeRate),
    shipping: itemShipping(order, item),
    total: 0,
    fee: params.value.minimumFee
  }

  const totalFee = roundUp((result.price + result.shipping) * params.value.fee)
  if (totalFee > result.fee) {
    result.fee = totalFee
  }
  result.total = roundUp(result.price + result.shipping + result.fee)
  return result
}

const roundUp = (num: number, precision: number = 2) => {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

</script>

<style>
.columns:not(:last-child) {
  margin-bottom: 0 !important;
}
</style>
