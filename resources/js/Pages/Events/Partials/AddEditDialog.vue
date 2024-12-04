<script setup>
import { ref } from "vue";
import { useForm } from "@inertiajs/inertia-vue3";
import { Inertia } from "@inertiajs/inertia";
import moment from "moment";
import Dialog from "@/Components/Common/DialogModal";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";

const emit = defineEmits(["close"]);

const props = defineProps({
    itemToEdit: {
        type: Object,
        default: null,
    },
});

const show = ref(false);
const editing = ref(false);

const form = useForm({
    title: "",
    starts_at: "",
    ends_at: "",
});

// Called when the user clicks on the "Add new" button
const onAddNew = () => {
    form.reset();
    show.value = true;
    editing.value = false;
};

// Called when the user submits the form
const onSubmit = () => {

    const startsAt = moment(form.starts_at, "YYYY-MM-DDTHH:mm", true);
    const endsAt = moment(form.ends_at, "YYYY-MM-DDTHH:mm", true);

    const formSend = {
        title: form.title,
        starts_at: startsAt.format("YYYY-MM-DD HH:mm"),
        ends_at: endsAt.format("YYYY-MM-DD HH:mm"),
    }

    const requestParams = {
        preserveScroll: true,
        onSuccess: onClose,
    };

    // Stores or updates the item
    if (editing.value) {
        Inertia.put(route("events.update", props.itemToEdit.id), formSend, requestParams);
    } else {
        Inertia.post(route("events.store"), formSend, requestParams);
    }
};

// Called when the dialog closes
const onClose = () => {
    form.reset();
    show.value = false;
    emit("close");
};
</script>

<template>
    <div>
        <Button @click="onAddNew">
            <vue-feather type="plus" />
            <span class="ml-2">Add new</span>
        </Button>
        <Dialog :show="show" @close="onClose">
            <template #header>{{
                editing ? "Edit event" : "Add new event"
            }}</template>
            <form @submit.prevent="onSubmit">
                <Input name="title" label="Title" v-model="form.title" class="mb-6" required />
                <Input name="starts_at" label="Start Date" type="datetime-local" v-model="form.starts_at" class="mb-6"
                    required />
                <Input name="ends_at" label="End Date" type="datetime-local" v-model="form.ends_at" class="mb-6"
                    required />
                <Button variant="secondary" class="mr-3" @click="onClose">Cancel</Button>
                <Button type="submit">Submit</Button>
            </form>
            <template #footer>

            </template>
        </Dialog>
    </div>
</template>

<style scoped></style>
