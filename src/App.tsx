import { defineComponent } from 'vue';
import Index from './views/Index.tsx'

export default defineComponent({
  name: 'App',
  components: {
    Index
  },
  setup() {
    return () => (
      <Index />
    )
  }
});
