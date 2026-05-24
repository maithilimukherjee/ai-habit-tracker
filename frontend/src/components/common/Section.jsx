import "../../styles/section.css"

function Section({
  title,
  subtitle,
  children
}) {

  return (
    <section className="custom-section">

      <div className="section-header">

        <h2>{title}</h2>

        {
          subtitle &&
          <p>{subtitle}</p>
        }

      </div>

      {children}

    </section>
  );

}

export default Section;