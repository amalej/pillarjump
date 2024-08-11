<script setup lang="ts">
import Score from '@/database/score';
import User from '@/database/user';
import { generateId } from '@/utils';
import { ref } from 'vue';

const userName = ref<string>('')
const isNameInputValid = ref<boolean>(true)
const props = defineProps<{
    score: number;
}>()
const emit = defineEmits([
    "closePopup",
    "submitScore"
])

function isNameValid(name: string): boolean {
    let isInputValid = true
    if (name.length === 0) {
        isInputValid = false
    }

    return isInputValid
}

function validateNameInput() {
    const _userName = userName.value.toUpperCase()
    isNameInputValid.value = isNameValid(_userName)
}

function cancel() {
    emit('closePopup')
}

function submit() {
    const _userName = userName.value.toUpperCase()
    const _isNameValid = isNameValid(_userName)
    if (!_isNameValid) {
        isNameInputValid.value = isNameValid(_userName)
    } else {
        const scoreId = `${generateId()}-sid`
        const userScore = {
            uid: User.localStorage.getId(),
            name: _userName,
            score: props.score,
            sid: scoreId,
        }

        Score.database.add(userScore);
        Score.localStorage.add(userScore)
        emit('submitScore', userScore)
    }
}
</script>

<template>
    <div id="main">
        <div class="card">
            <div class="card-content">
                <div class="card-header">New High Score</div>
                <div style="margin-bottom: 0.5em;"></div>
                <div class="card-body">
                    <div class="high-score">
                        <v-icon name="bi-trophy-fill" class="trophy-icon" />
                        <div class="high-score-value">
                            {{ props.score }}
                        </div>
                    </div>
                    <div class="form__group field">
                        <input type="input" class="form__field" placeholder="Name" @input="validateNameInput"
                            v-model="userName">
                        <label for="name" class="form__label">Name</label>
                    </div>
                    <div class="invalid-name-prompt" v-if="!isNameInputValid">Invalid Name</div>
                </div>
                <div class="card-footer">
                    <div class="card-button" :onclick="cancel">Cancel</div>
                    <div class="card-button" :onclick="submit">Submit</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
#main {
    font-family: Arial, Helvetica, sans-serif;
    top: 0px;
    left: 0px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    display: flex;
    z-index: 100;
}

.card {
    width: clamp(300px, 40%, 512px);
    background-color: rgba(0, 0, 0, 0.4);
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    border: 0.1em solid var(--game-pink-color-dark);
    padding: 0.75em;
    flex-direction: column;
}

.card-header {
    color: white;
    display: flex;
    width: 100%;
    letter-spacing: 0.05em;
    font-size: 1.75em;
    font-weight: 500;
    text-align: left;
    font-family: Arial;
    justify-content: center;
    align-items: center;
}

.card-body {
    height: 100%;
    display: flex;
    margin: 0.75em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.card-footer {
    display: flex;
    text-align: left;
    font-family: Arial;
    justify-content: center;
}

.card-button {
    color: white;
    border: 0.15em solid white;
    padding: 0.5em;
    margin: 0.5em;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
}

.high-score {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    padding: 0.2em;
    font-size: 1.5em;
}

.trophy-icon {
    height: 0.85em;
    width: 0.85em;
    margin-right: 0.25em;
}

.invalid-name-prompt {
    margin: 0px 0.25em;
    font-size: 0.8em;
    letter-spacing: 0.1em;
    font-weight: 600;
    text-transform: uppercase;
    color: rgb(187, 52, 52);
    display: flex;
    width: max-content;
    width: calc(100% - 0.5em);
    align-items: start;
}
</style>


<style lang="css" scoped>
/* CSS for the text input */

.form__group {
    position: relative;
    padding: 1em 0em;
    width: calc(100% - 0.5em);
}

.form__field {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    width: 100%;
    border: none;
    border-bottom: 0.2em solid #9b9b9b;
    outline: 0;
    font-size: 1.2em;
    color: #fff;
    padding: 0.5em 0;
    background: transparent;
    transition: border-color 0.2s;
}

.form__field::placeholder {
    color: transparent;
}

.form__field:placeholder-shown~.form__label {
    font-size: 1em;
    cursor: text;
    top: 1.5em;
}

.form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1em;
    color: #9b9b9b;
    pointer-events: none;
    font-weight: 600;
}

.form__field:focus {
    padding-bottom: 0.5em;
    font-weight: 600;
    border-width: 0.2em;
    border-image: linear-gradient(to right, #aa7777, #aa7777);
    border-image-slice: 1;
}

.form__field:focus~.form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1em;
    color: #aa7777;
    font-weight: 700;
}

.form__field:required,
.form__field:invalid {
    box-shadow: none;
}
</style>