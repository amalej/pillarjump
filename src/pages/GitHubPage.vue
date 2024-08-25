<template>
    <div id="main">
        <div class="card">
            <div class="card-header">GitHub</div>
            <div class="card-body">
                <div class="link-contianer"
                    :onclick="() => handleLinkClick('https://github.com/amalej/pillarjump', 'open_github_repository')">
                    <v-icon name="bi-github" class="icon" />
                    <div class="link-text"></div>
                    GitHub Repository
                </div>
                <div class="link-contianer"
                    :onclick="() => handleLinkClick('https://github.com/amalej/pillarjump/issues/new?assignees=&labels=bug&projects=&template=bug-report.md&title=%5Bbug%5D+', 'open_github_report_bug')">
                    <v-icon name="bi-bug" class="icon" />
                    <div class="link-text"></div>
                    Report Bug
                </div>
                <div class="link-contianer"
                    :onclick="() => handleLinkClick('https://github.com/amalej/pillarjump/issues/new?assignees=&labels=enhancement&projects=&template=feature-request.md&title=%5BFR%5D+', 'open_github_feature_request')">
                    <v-icon name="hi-light-bulb" class="icon" />
                    <div class="link-text"></div>
                    Feature Request
                </div>
            </div>
            <div class="card-footer">
                <div class="card-button" :onclick="async () => await router.push({ path: '/' })">
                    <v-icon name="md-arrowback-round" class="return-icon"></v-icon>
                    <div class="Return-text">Return</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logEvent } from '@/firebase/analytics'

logEvent("render_github_page")
const router = useRouter()

function handleLinkClick(link: string, event?: string) {
    if (event) logEvent(event)
    window.open(link, "_blank");
}
</script>

<style scoped>
.icon {
    height: 1.5em;
    width: 1.5em;
}

.link-text {
    margin-left: 0.25em;
}

.link-contianer {
    color: white;
    letter-spacing: 0.08em;
    font-size: 1.12em;
    display: flex;
    align-items: center;
    border: 0.1em solid white;
    padding: 0.35em;
    width: 90%;
    margin: 0.25em 0em;
}


#main {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1000;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
}


.card {
    width: clamp(300px, 40%, 512px);
    max-height: 75%;
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
    margin: 0.25em 0em;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
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

.return-icon {
    margin: 0em 0.25em;
    display: flex;
    align-items: center;
}
</style>