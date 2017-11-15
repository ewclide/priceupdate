<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="jquery.js"></script>
	<script src="priceupdate.js"></script>
</head>
<body>
	<p 
	id="old_price"
	data-price-value="7000"
	>7000 р.</p>

	<p 
	class="priceupdate"
	data-price-old="#old_price"
	data-price-points="price"
	data-price-value="5000"
	data-price-currency=" р."
	>5000 р.</p>

	<p 
	class="priceupdate"
	data-price-points="price2"
	data-price-value="5000"
	data-price-currency=" р."
	>5000 р.</p>

	<div>
		<div>
			
			<input  
			data-price-target="price"
			data-price-operator="+"
			data-price-value="2000"
			type="checkbox"
			name="checkbox"
			>
			<label>+2000</label>

			
			<input  
			data-price-target="price"
			data-price-operator="-"
			data-price-value="3000"
			type="checkbox"
			name="checkbox"
			>
			<label>-3000</label>

			
			<input  
			data-price-target="price"
			data-price-operator="+%"
			data-price-value="10"
			type="checkbox"
			name="checkbox"
			>
			<label>+10%</label>

			
			<input  
			data-price-target="price2"
			data-price-operator="-"
			data-price-value="3000"
			type="checkbox"
			name="checkbox"
			>
			<label>-3000</label>
		</div>
		<div>
			
			<input  
			data-price-target="price"
			data-price-operator="+"
			data-price-value="3000"
			type="radio"
			name="radio"
			>
			<label>+3000</label>

			
			<input  
			data-price-target="price"
			data-price-operator="+"
			data-price-value="1000"
			type="radio"
			name="radio"
			>
			<label>+1000</label>

			
			<input  
			data-price-target="price"
			data-price-operator="-"
			data-price-value="2000"
			type="radio"
			name="radio"
			>
			<label>-2000</label>
			
		</div>
		<div>
			<select
			data-price-target="price"
			name="select"
			>
				<option>не выбрано</option>
				<option data-price-operator="+" data-price-value="1500">+ 1500</option>
				<option data-price-operator="-" data-price-value="1000">- 1000</option>
				<option data-price-operator="*" data-price-value="2">* 2</option>
			</select>
		</div>
		
	</div>
</body>
</html>