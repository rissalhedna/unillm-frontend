<script>
	import Logout from '$lib/components/Logout.svelte';
	import '../app.css';
	
	export let data;
	$: isLoggedIn = !!data.user;
</script>

<Logout {isLoggedIn} />
<slot></slot>
