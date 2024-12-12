<script>
	import * as Card from '$lib/components/ui/card';

	let { data } = $props();
	console.log(data.post);

	let post = data.post[0];
</script>

<div class="container">
	<div class="grid grid-cols-12 gap-2">
		<Card.Root class="col-span-9">
			<Card.Header>
				<Card.Title>{post.title.rendered}</Card.Title>
				<Card.Description>Card Description</Card.Description>
			</Card.Header>
			<Card.Content>
				{@html post.content.rendered}
			</Card.Content>
			<Card.Footer>
				<!--  -->
			</Card.Footer>
		</Card.Root>
		<Card.Root  class="col-span-3">
			<Card.Header>
			  <Card.Title>Card Title</Card.Title>
			  <Card.Description>Card Description</Card.Description>
			</Card.Header>
			<Card.Content>
			  <p>Card Content</p>
			</Card.Content>
			<Card.Footer>
			  <p>Card Footer</p>
			</Card.Footer>
		  </Card.Root>
	</div>
	{JSON.stringify(post)}
	
</div>
