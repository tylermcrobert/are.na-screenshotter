<script lang="ts">
	let loading = $state(false);
</script>

<form method="POST">
	<fieldset>
		<h1>Screenshot</h1>
		<button
			type="submit"
			disabled={loading}
			onclick={async (e) => {
				loading = true;
				e.preventDefault();

				const res = await fetch('/api/upload', {
					method: 'POST',
					body: JSON.stringify({ image: 'bar' })
				});

				const data = await res.json();
				loading = false;

				console.log(data);
			}}
		>
			Take Screenshot
		</button>
		{#if loading}
			<div>loading...</div>
		{/if}
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
