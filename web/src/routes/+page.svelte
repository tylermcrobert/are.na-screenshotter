<script lang="ts">
	import { IMAGE_BASE_64 } from './../lib/constants';
	let loading = $state(false);
	let error = $state<string | undefined>(undefined);

	async function upload() {
		loading = true;
		error = undefined;

		const res = await fetch('/api/upload', {
			method: 'POST',
			body: JSON.stringify({ image: IMAGE_BASE_64 })
		});

		const body = await res.json();

		if (!res.ok) {
			error = body.error ? body.error : 'An unknown error occurred.';
		}

		loading = false;
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		upload();
	}}
>
	<fieldset>
		<h1>Screenshot</h1>
		<button type="submit" disabled={loading}>Take Screenshot</button>

		<div>
			{#if loading}
				<div>loading...</div>
			{/if}

			{#if error}
				<div>Error: {error}</div>
			{/if}
		</div>
	</fieldset>
</form>

<hr />

<fieldset>
	<h1>Post to channel</h1>

	<h2>channels:</h2>

	{#each ['a', 'b', 'c'] as channel}
		<div>
			<input type="radio" id={channel} name="channel" value={channel} checked />
			<label for={channel}>Channel {channel}</label>
		</div>
	{/each}

	<button type="submit">Submit</button>
	<button>cancel</button>
</fieldset>
