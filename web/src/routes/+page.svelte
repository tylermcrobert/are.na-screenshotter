<form method="POST">
	<button
		type="submit"
		onclick={async (e) => {
			e.preventDefault();

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: JSON.stringify({ foo: 'bar' })
			});

			const data = await res.json();

			console.log(data);
		}}
	>
		Submit
	</button>
</form>
