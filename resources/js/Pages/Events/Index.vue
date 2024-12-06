<script setup>
import { onMounted, ref } from "vue";
import { Inertia } from "@inertiajs/inertia";
import moment from "moment";
import AppLayout from "@/Layouts/AppLayout";
import AddEditDialog from "./Partials/AddEditDialog";
import Button from "@/Components/Common/Button";
import Dialog from "@/Components/Common/DialogModal";
import Table from "@/Components/Common/Table";
import Input from "@/Components/Common/Input";
import { title } from "process";
import CalendarPopup from "@/Components/Common/DateTimePickers/Partials/CalendarPopup.vue";
import DateRangePicker from "@/Components/Common/DateTimePickers/DateRangePicker.vue";
import DateTimePicker from "@/Components/Common/DateTimePickers/DateTimePicker.vue";

const format = "YYYY-MM-DD";

const props = defineProps({
    events: {
        type: Array,
        default: [],
    },
    title: String,
    starts_at: String,
    ends_at: String,
});

const dateFilters = ref([null, null]);

// Load url params into state if any existed on mount
onMounted(() => {
    if (props.starts_at) {
        dateFilters.value[0] = moment(props.starts_at, format);
    }
    if (props.ends_at) {
        dateFilters.value[1] = moment(props.ends_at, format);
    }
});

const itemToEdit = ref(null);
const itemToDelete = ref(null);

const onUpdate = () => {
    itemToEdit.value.starts_at = moment(itemToEdit.value.starts_at).format('YYYY-MM-DD HH:mm');
    itemToEdit.value.ends_at = moment(itemToEdit.value.ends_at).format('YYYY-MM-DD HH:mm');

    Inertia.put(route("events.update", itemToEdit.value.id), {
        title: itemToEdit.value.title,
        starts_at: itemToEdit.value.starts_at,
        ends_at: itemToEdit.value.ends_at,
        preserveScroll: true,
        onSuccess: () => {
            itemToEdit.value = null;
        },
    });
}
const onDelete = () => {
    Inertia.delete(route("events.destroy", itemToDelete.value.id), {
        preserveScroll: true,
        onSuccess: () => {
            itemToDelete.value = null;
        },
    });
};
</script>

<template>
    <AppLayout title="Events">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Events
            </h2>
        </template>

        <div class="card">
            <DateRangePicker v-model="dateFilters" />
            <DateTimePicker />
            <div class="mb-3">
                <div class="mb-6 flex flex-row justify-between items-end">
                    <div>
                        <AddEditDialog />

                    </div>
                </div>
                <Dialog :show="itemToEdit != null" @close="itemToEdit = null">
                    <template #header>Edit event</template>
                    <div class="p-6">
                        <form @submit.prevent="onUpdate">
                            <Input name="title" label="Title" v-model="itemToEdit.title" class="mb-3" required />
                            <Input name="starts_at" label="Start Date" type="datetime-local"
                                v-model="itemToEdit.starts_at" class="mb-3" required />
                            <Input name="ends_at" label="End Date" type="datetime-local" v-model="itemToEdit.ends_at"
                                class="mb-3" required />
                            <div class="mb-2">
                                <Button variant="secondary" class="mr-3" @click="itemToEdit = null">Cancel</Button>
                                <Button variant="danger" type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>
                    <template #footer>

                    </template>
                </Dialog>
                <Dialog :show="itemToDelete != null" @close="itemToDelete = null">
                    <template #header>Deleting event</template>
                    Are you sure you want to delete this event ?
                    <template #footer>
                        <Button variant="secondary" class="mr-3" @click="itemToDelete = null">Cancel</Button>
                        <Button variant="danger" @click="onDelete">Submit</Button>
                    </template>
                </Dialog>
            </div>
            <Table :data="events" :headings="['Title', 'Date', 'Actions']">
                <template #row="{ item }">
                    <td>{{ item.title }}</td>
                    <td>
                        {{ moment(item.starts_at).format("HH:mm DD/MM/YYYY") }}
                    </td>
                    <td>
                        {{ moment(item.ends_at).format("HH:mm DD/MM/YYYY") }}
                    </td>
                    <td>
                        <span class="px-2 text-gray-700 hover:text-blue-500 cursor-pointer transition">
                            <vue-feather type="edit" size="1.3rem" @click="itemToEdit = item" />
                        </span>
                        <span class="px-2 text-gray-700 hover:text-red-500 cursor-pointer transition">
                            <vue-feather type="trash" size="1.3rem" @click="itemToDelete = item" />
                        </span>
                    </td>
                </template>
            </Table>
        </div>
    </AppLayout>
</template>

<style scoped></style>
<!-- TO DO fermer la pop up de la modal de l'update -->