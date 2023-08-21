# Keskuskauppa: A safer user-to-user marketplace

## Project description

Tired of the uncertainty of secondhand online shopping? The Finnish market offers many platforms to buy and sell secondhand items user to user, but none of them guarantees a particularly safe user experience. Inspired by this, we set out to create an online secondhand marketplace with added security.

To do this, we lent ideas from the international market of second hand selling and designed a system that works for the Finnish market and locality. 

### Features in a nutshell

The most important feature is buyer's security in making a purchase. Once a purchase is made, instead of wiring the money to the seller with no guarantee of ever receiving the product, the service holds on to the payment until the buyer has confirmed that the product has been received. If no product is received, the system returns the money to the buyer. The security of the seller is also guaranteed, as they won't be asked to send anything before the buyer has made the payment. All activity on the website is overseen by admin.

Other features that reinforce a secure buying experience are messaging between buyer and seller as well as a seller review system.

### Features in detail

User-to-user messaging: Contact the seller before making a purchase to ask questions and discuss.

Secure market place: Only registered users can make purchases, sell items and take part in user-to-user messaging. All new profiles are checked by admin. Admin oversees the transactions between buyer and seller. 

Secure buying experience: The service holds on to your money while you wait to receive your purchase. The seller confirms the shipment by logging the related tracking code on the website. When the buyer has received the product, they manually confirm it. Only then is the money wired to the seller. In case the seller has successfully sent the product with tracking information that can be found on the deliverer's website and the buyer claims not to have received it, the matter will be investigated by admin.

Seller review system: Leave an honest review of your experience with a particular seller. Includes a star review as well as a written comment. Read reviews others have given to get a better idea of how trustworthy a seller has been found to be by others.

View products by category: Browse items by category. This feature is also available for non-registered users.

Search: search directly for items.

## Key Tech Insights

This undertaking was built as a fullstack project as part of a fullstack web development course.

- Powered by: TypeScript, Node.js, React, Express.js, PSQL and Docker
- Cloud: Azure-backed for a reliable experience [Keskuskauppa on Azure](https://keskuskauppa-app.azurewebsites.net/)
- Quality Matters: Rigorous testing with Jest, and linted to excellence with ESLint.

### Database structure

![schema](./docs/database-structure.png)

### UI plan

![schema](./docs/UI-planning.png)

## How to install and run

Here's how to get the program running.

1. In terminal, navigate to the directory where you cloned the project and run command `npm install`. 
2. Build a docker image with command `npm run docker:build`
3. Run the docker image with command `npm run docker:start`. This uses local settings for the application in `.env` file. `.env` file **must be** in backend directory only and does not come with the repository. Here are the basic details of what the file should include:

PORT= The port you are using on localhost  
PG_HOST= The IP address of your database  
PG_PORT= Local database port  
PG_USERNAME= Admin username  
PG_PASSWORD= Admin password  
PG_DATABASE= The name of your database  
SECRET= A secret word defined by you  

4. Next, run command `npm run dev`. This runs both frontend and backend in development mode and watches for any changes in files in ./src directories.

## Dev team

**Maaret Lyytinen**  
@: maaret.lyytinen@gmail.com  
gitlab: https://gitlab.com/maarly  
LinkedIn: https://www.linkedin.com/in/maaretlyytinen/  

**Toni Vainionpää**  
@: neworen(at)gmail.com  
gitlab: https://gitlab.com/Toni86-pang
LinkedIn:  https://www.linkedin.com/in/toni-vainionpaa/

**Joonas Huhdanmäki**  
@jhuhdanmaki@gmail.com
github: https://github.com/jopinihu
linkedin: www.linkedin.com/in/joonas-huhdanmäki

**Paula Häyrynen**  
Linkki1:  
Linkki2:  
Linkki3:  
