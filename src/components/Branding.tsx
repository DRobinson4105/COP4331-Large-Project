import Logo from "../assets/NomNom Network Logo.png"

function PageTitle()
{
   return(
        <div>
            <img src={Logo} style={{width: 50, height: 50, display: "inline-block", verticalAlign: "middle"}} alt="Logo"/>
            <h1 className='branding' style={{margin: "10px", verticalAlign: "middle"}}>Nom Nom Network</h1>
        </div>
   );
};

export default PageTitle;