import { onMounted } from "@vue/composition-api"

export default function gameManager() {
  onMounted(() => {
    console.log('mounted game manager')
  })
}
